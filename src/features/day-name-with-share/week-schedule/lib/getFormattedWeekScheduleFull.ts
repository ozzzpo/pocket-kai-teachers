import { WeekSchedule } from '@/shared';
import { getFormattedDayScheduleFull } from './getFormattedDayScheduleFull';

export const getFormattedWeekScheduleFull = (
  weekSchedule: WeekSchedule,
  weekParity: 'even' | 'odd'
) => {
  const requiredWeekSchedule = weekSchedule[weekParity];
  const result = Object.entries(requiredWeekSchedule).map(
    ([dayName, dayLessons], index) => {
      if (index === 6) return '';
      const header = `${dayName}\n————————————————————\n`;
      const footer = `————————————————————\n`;
      if (!dayLessons.length) return header + 'Выходной\n' + footer;
      return (
        header +
        getFormattedDayScheduleFull(dayName, dayLessons, weekParity, '', true) +
        footer
      );
    }
  );
  return (
    `${weekParity === 'even' ? 'Чётная' : 'Нечётная'} неделя\n\n` +
    result.join('\n') +
    `Отправлено из Pocket KAI: ${window.location.origin}`
  );
};
