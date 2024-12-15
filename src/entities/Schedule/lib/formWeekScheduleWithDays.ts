import { FullSchedule, Lesson, Nullable } from '@/shared';

export const formWeekScheduleWithDays = (
  fullSchedule: Nullable<FullSchedule>
) => {
  if (!fullSchedule)
    return {
      even: {},
      odd: {},
    };
  const weekEven: Record<string, Lesson[]> = {
    Понедельник: [],
    Вторник: [],
    Среда: [],
    Четверг: [],
    Пятница: [],
    Суббота: [],
  };
  const weekOdd: Record<string, Lesson[]> = {
    Понедельник: [],
    Вторник: [],
    Среда: [],
    Четверг: [],
    Пятница: [],
    Суббота: [],
  };
  Object.entries(weekEven).forEach(([, lessons], index) => {
    fullSchedule.even.forEach((lesson) => {
      if (lesson.number_of_day === index + 1) {
        lessons.push(lesson);
      }
    });
  });
  Object.entries(weekOdd).forEach(([, lessons], index) => {
    fullSchedule.odd.forEach((lesson) => {
      if (lesson.number_of_day === index + 1) {
        lessons.push(lesson);
      }
    });
  });

  return {
    even: weekEven,
    odd: weekOdd,
  };
};
