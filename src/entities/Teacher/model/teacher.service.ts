import { apiClient, ApiResponse, Teacher } from '@/shared';

export const teacherService = {
  suggestTeacherByName: (name: string): ApiResponse<Teacher[]> => {
    return apiClient.get<Teacher[]>('/teacher/suggest_by_name', {
      params: { name },
    });
  },

  getTeacherByLogin: (login: string): ApiResponse<Teacher> => {
    return apiClient.get<Teacher>(`/teacher/by_login/${login}`);
  },
};
