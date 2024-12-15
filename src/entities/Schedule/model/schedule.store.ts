import { create } from 'zustand';
import { ScheduleParams } from './types';
import { scheduleService } from './schedule.service';
import {
  Nullable,
  WeekParity,
  FetchStatus,
  FullSchedule,
  Day,
  WeekSchedule,
} from '@/shared';
import { generateDateSchedule } from '../lib/generateDateSchedule';
import { formFullSchedule } from '../lib/formFullSchedule';
import { DateTime } from 'luxon';
import { persist } from 'zustand/middleware';
import { getCurrentSemester } from '@/shared/lib';
import { formWeekScheduleWithDays } from '../lib/formWeekScheduleWithDays';

type StoreState = {
  schedule: Day[];
  fullSchedule: Nullable<FullSchedule>;
  weekSchedule: Nullable<WeekSchedule>;
  semester: 'first' | 'second' | 'winterHoliday' | 'summerHoliday' | 'holiday';
  examsSchedule: null;
  parity: Nullable<WeekParity>;
  scheduleStatus: FetchStatus;
  fullScheduleStatus: FetchStatus;
  error: Nullable<unknown>;
};
type StoreActions = {
  getFullScheduleByTeacherId: (teacherId: string) => Promise<void>;
  addToCurrentSchedule: (
    params: ScheduleParams,
    isNextWeek?: boolean
  ) => Promise<void>;
  getSchedule: (params: ScheduleParams) => Promise<void>;
  getWeekParity: (params?: WeekParity) => Promise<void>;
  resetScheduleState: () => void;
};

const initialState: StoreState = {
  schedule: [],
  fullSchedule: null,
  weekSchedule: null,
  examsSchedule: null,
  semester: getCurrentSemester(),
  parity: {
    date: '',
    parity:
      DateTime.now().setZone('Europe/Moscow').weekNumber % 2 ? 'odd' : 'even',
    int_parity: 0,
  },
  scheduleStatus: 'idle',
  fullScheduleStatus: 'idle',
  error: null,
};

export const useSchedule = create<StoreState & StoreActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      getFullScheduleByTeacherId: async (teacherId) => {
        set({ fullScheduleStatus: 'loading' });
        try {
          const response = await scheduleService.getWeekScheduleByTeacherId(
            teacherId
          );
          const anyWeek = formFullSchedule(response.data);

          set({
            fullSchedule: { ...anyWeek },
            fullScheduleStatus: 'success',
            weekSchedule: formWeekScheduleWithDays(anyWeek),
          });
        } catch (error) {
          set({ error, fullScheduleStatus: 'error' });
        }
      },

      addToCurrentSchedule: async (
        params: ScheduleParams,
        isNextWeek = false
      ) => {
        set({ scheduleStatus: 'loading' });
        try {
          const response = await generateDateSchedule(
            get().fullSchedule,
            params
          );
          set({
            schedule: isNextWeek
              ? [...get().schedule, ...response]
              : [...response, ...get().schedule],

            scheduleStatus: 'idle',
          });
        } catch (error) {
          set({ error, scheduleStatus: 'error' });
        }
      },

      getSchedule: async (params: ScheduleParams) => {
        const response = await generateDateSchedule(get().fullSchedule, params);
        set({
          schedule: [...response],
        });
      },
      getWeekParity: async (params?: WeekParity) => {
        const response = await scheduleService.getWeekParity(params);
        set({ parity: response.data });
      },

      resetScheduleState: () => set(initialState),
    }),
    {
      name: 'schedule-store',
      partialize: (state) => ({
        weekSchedule: state.fullSchedule,
      }),
    }
  )
);
