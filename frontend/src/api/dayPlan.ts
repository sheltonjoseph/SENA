import api from './config';

interface DayPlanResponse {
  morning: {
    time: string;
    activity: string;
    location: string;
    description: string;
  };
  afternoon: {
    time: string;
    activity: string;
    location: string;
    description: string;
  };
  evening: {
    time: string;
    activity: string;
    location: string;
    description: string;
  };
}

export const dayPlanApi = {
  generateDayPlan: async (
    location: string,
    date: string,
    vibe: string
  ): Promise<DayPlanResponse> => {
    const response = await api.post('/day-plan/generate', {
      location,
      date,
      vibe,
    });
    return response.data.data;
  },
}; 