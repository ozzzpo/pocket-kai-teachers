import { Day, FullSchedule, Lesson, Nullable } from '@/shared';
import { DateTime } from 'luxon';
import { ScheduleParams } from '../model/types';
import { SEMESTER_BREAKPOINTS } from '@/shared/constants';
import { getCurrentSemester } from '@/shared/lib';
export async function generateDateSchedule(
  fullSchedule: Nullable<FullSchedule>,
  params: ScheduleParams
): Promise<Day[]> {
  if (!fullSchedule || !params.date_from) return [];

  const dateFrom = DateTime.fromISO(params.date_from);

  const dateSchedule: Day[] = [];
  const currentSemester = getCurrentSemester();
  const currentSemesterCondition = (
    targetDate: DateTime<true> | DateTime<false>
  ) => {
    if (currentSemester === 'first' || currentSemester === 'summerHoliday') {
      return SEMESTER_BREAKPOINTS.firstSemester.contains(targetDate);
    }
    if (currentSemester === 'second' || currentSemester === 'winterHoliday') {
      return SEMESTER_BREAKPOINTS.secondSemester.contains(targetDate);
    }
  };
  for (let i = 0; i < params.days_count; i++) {
    const targetDate = dateFrom.startOf('week').plus({ days: i });

    let lessons: Lesson[] = [];
    if (currentSemesterCondition(targetDate)) {
      const targetWeekParity = targetDate.weekNumber % 2 === 0 ? 'even' : 'odd';
      const dayNumber = targetDate.weekday;
      lessons = fullSchedule[targetWeekParity]?.filter(
        (lesson) => lesson.number_of_day === dayNumber
      );
    }
    dateSchedule.push({
      date: targetDate.toISODate()!,
      lessons: lessons,
    });
  }

  return dateSchedule;
}
