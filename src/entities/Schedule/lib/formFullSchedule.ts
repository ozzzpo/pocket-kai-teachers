import { Lesson } from '@/shared';

export const formFullSchedule = (teachersSchedule: Lesson[]) => {
  const odd: Lesson[] = [];
  const even: Lesson[] = [];
  teachersSchedule.forEach((lesson) => {
    (lesson as any).hide_type = 'none';
    if (lesson.parsed_parity === 'any') {
      odd.push(lesson);
      even.push(lesson);
    }
    if (lesson.parsed_parity === 'odd') {
      odd.push(lesson);
    }
    if (lesson.parsed_parity === 'even') {
      even.push(lesson);
    }
  });
  return { odd, even };
};
