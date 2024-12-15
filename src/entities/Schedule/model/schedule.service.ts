import { apiClient, ApiResponse, WeekParity, Lesson } from '@/shared';
import { ParityParams } from './types';

export const scheduleService = {
  getWeekScheduleByTeacherId: (teacherId: string): ApiResponse<Lesson[]> => {
    return apiClient.get<Lesson[]>(`teacher/by_id/${teacherId}/schedule`, {
      params: {
        week_parity: 'any',
      },
    });
  },
  getWeekParity: (params?: ParityParams): ApiResponse<WeekParity> => {
    return apiClient.get<WeekParity>(`week_parity`, {
      params,
    });
  },
};
