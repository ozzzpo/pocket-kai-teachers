import { FetchStatus, HiddenLesson, IHiddenLessons, Teacher } from '@/shared';
import { Nullable } from '@/shared';
import { create } from 'zustand';
import { teacherService } from './teacher.service';
import { getWeekParityDate } from '@/shared/lib';
import { persist } from 'zustand/middleware';
import { getCurrentSemester } from '@/shared/lib';

type TeachersState = {
  currentTeacher: Nullable<Teacher>;
  favouriteTeachers: Teacher[];
  searchedTeachers: Teacher[];
  searchedTeachersStatus: FetchStatus;
  hiddenLessons: IHiddenLessons[];
  error: Nullable<unknown>;
};
type TeachersActions = {
  suggestTeacherByName: (name: string) => Promise<void>;
  setCurrentTeacher: (teacher: Teacher) => void;
  getTeacherByLogin: (login: string) => Promise<Teacher>;
  addTeacherToFavourite: (teacher: Teacher) => void;
  removeTeacherFromFavourite: (teacher: Teacher) => void;
  clearTeachersState: () => void;

  addHiddenLesson: (
    lesson: HiddenLesson,
    teacher?: Teacher,
    isAlways?: boolean
  ) => void;
  updateHiddenLesson: (today: string) => void;
  deleteHiddenLesson: (id: string, type_hide: string) => void;
  deleteAllHiddenLesson: () => void;
  deleteGroupHiddenLesson: (teacherName: string) => void;
};

const initialState: TeachersState = {
  currentTeacher: null,
  favouriteTeachers: [],
  searchedTeachers: [],
  searchedTeachersStatus: 'idle',
  hiddenLessons: [],
  error: null,
};

export const useTeachers = create<TeachersState & TeachersActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      suggestTeacherByName: async (name) => {
        set({ searchedTeachersStatus: 'loading', error: null });
        try {
          const response = await teacherService.suggestTeacherByName(name);
          set({
            searchedTeachers: response.data,
            searchedTeachersStatus: 'success',
          });
        } catch (error) {
          set({ error, searchedTeachersStatus: 'error' });
        }
      },

      getTeacherByLogin: async (login) => {
        const response = await teacherService.getTeacherByLogin(login);
        set({ currentTeacher: response.data });
        return response.data;
      },

      setCurrentTeacher(teacher) {
        set({ currentTeacher: teacher });
      },

      addTeacherToFavourite(teacher) {
        const isAlreadyFavourite = get().favouriteTeachers.some(
          (favTeacher) => favTeacher.id === teacher.id
        );
        console.log(teacher);
        if (isAlreadyFavourite || get().favouriteTeachers.length >= 10) {
          return;
        }
        set({ favouriteTeachers: [...get().favouriteTeachers, teacher] });
      },

      removeTeacherFromFavourite(teacher) {
        set((state) => ({
          ...state,
          favouriteGroups: state.favouriteTeachers.filter(
            (favouriteTeachers) => favouriteTeachers.id !== teacher.id
          ),
        }));
      },

      addHiddenLesson: async (lesson, teacher, isAlways) => {
        const currentHiddenLessons = get().hiddenLessons;

        const updatedHiddenLessons = currentHiddenLessons.filter(
          (hiddenLesson) => {
            const isSameLesson = hiddenLesson.lesson.id === lesson.id;

            // Обрабатываем "скрыть навсегда"
            if (lesson.type_hide === 'always') {
              return !isSameLesson;
            }

            // Обрабатываем чётные/нечётные недели
            if (lesson.type_hide === 'odd' || lesson.type_hide === 'even') {
              const typeHideParity = lesson.type_hide;

              const hasOppositeParity = currentHiddenLessons.some(
                (hiddenLesson) =>
                  hiddenLesson.lesson.id === lesson.id &&
                  ((hiddenLesson.lesson.type_hide === 'odd' &&
                    typeHideParity === 'even') ||
                    (hiddenLesson.lesson.type_hide === 'even' &&
                      typeHideParity === 'odd'))
              );

              if (hasOppositeParity) {
                // Удаляем противоположную запись (чёт/нечёт)
                if (isAlways) {
                  hiddenLesson.lesson.type_hide = 'always';
                }
                return !isSameLesson;
              }

              // Удаляем записи с конкретной датой, если совпадают по чётности
              if (hiddenLesson.lesson.type_hide.includes('-')) {
                const hiddenLessonParity = getWeekParityDate(
                  hiddenLesson.lesson.type_hide
                );
                return !(isSameLesson && hiddenLessonParity === typeHideParity);
              }

              // Удаляем существующие "always"
              if (hiddenLesson.lesson.type_hide === 'always') {
                return !isSameLesson;
              }

              return true;
            }

            return true;
          }
        );

        // Проверка на дубликаты
        const isDuplicate = updatedHiddenLessons.some(
          (hiddenLesson) =>
            hiddenLesson.lesson.id === lesson.id &&
            hiddenLesson.lesson.type_hide === lesson.type_hide
        );

        if (!isDuplicate) {
          const updatedLesson = {
            lesson,
            teacher,
          };
          set({
            hiddenLessons: [...updatedHiddenLessons, updatedLesson],
          });
        }
      },
      updateHiddenLesson: async (today: string) => {
        const updatedHiddenLessons = get().hiddenLessons.filter((lesson) => {
          return !(
            (lesson.lesson.type_hide.includes('-') &&
              lesson.lesson.type_hide < today) ||
            getCurrentSemester() === 'holiday'
          );
        });
        set({
          hiddenLessons: updatedHiddenLessons,
        });
      },
      deleteHiddenLesson: async (id: string, type_hide: string) => {
        const updatedHiddenLessons = get().hiddenLessons.filter(
          (lesson) =>
            lesson.lesson.id !== id || lesson.lesson.type_hide !== type_hide
        );
        set({
          hiddenLessons: updatedHiddenLessons,
        });
      },
      deleteGroupHiddenLesson: async (group_name: string) => {
        const updatedHiddenLessons = get().hiddenLessons.filter(
          (lesson) => lesson.group?.group_name !== group_name
        );
        set({
          hiddenLessons: updatedHiddenLessons,
        });
      },
      deleteAllHiddenLesson: async () => {
        set({
          hiddenLessons: [],
        });
      },

      clearTeachersState: () => set(initialState),
    }),
    {
      name: 'teacherStore',
      partialize: (state) => ({
        hiddenLessons: state.hiddenLessons,
        currentTeacher: state.currentTeacher,
        favouriteTeachers: state.favouriteTeachers,
      }),
    }
  )
);
