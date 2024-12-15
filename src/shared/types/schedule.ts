import { WeekSchedule } from '@/pages';
import { Lesson } from './lesson';

export type FullSchedule = {
  odd: Lesson[];
  even: Lesson[];
};

export type WeekSchedule = {
  odd: Record<string, Lesson[]>;
  even: Record<string, Lesson[]>;
};

export type Schedule = Day[];

export type Day = {
  date: string;
  lessons: Lesson[];
};

export type WeekParity = {
  date: string;
  parity: 'odd' | 'even';
  int_parity: number;
};

export type ScheduleView = 'timeline' | 'full';
