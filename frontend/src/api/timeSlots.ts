import api from './config';
import type { TimeSlot } from '@/types';

const timeSlotApi = {
  getAllTimeSlots: async (): Promise<TimeSlot[]> => {
    try {
      const response = await api.get('/time-slots');
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch time slots');
      }
    } catch (error) {
      console.error('Error in getAllTimeSlots:', error);
      throw error;
    }
  },
};

export { timeSlotApi }; 