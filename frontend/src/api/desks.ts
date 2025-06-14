import api from './config';
import type { Desk, DeskAvailability } from '@/types';

export const deskApi = {
  // Get all desks for a location
  getDesksByLocation: async (locationId: string): Promise<Desk[]> => {
    const response = await api.get(`/desks/location/${locationId}`);
    return response.data.data;
  },

  // Get desk availability
  getDeskAvailability: async (
    deskId: string,
    date: string
  ): Promise<DeskAvailability[]> => {
    const response = await api.get(`/desks/${deskId}/availability`, {
      params: { date }
    });
    return response.data.data;
  },

  // Hold a desk
  holdDesk: async (
    deskId: string,
    timeSlotId: string,
    date: string
  ): Promise<{ holdId: string; expiresAt: string }> => {
    const response = await api.post('/desks/hold', {
      deskId,
      timeSlotId,
      date
    });
    return response.data.data;
  },

  // Book a desk
  bookDesk: async (holdId: string): Promise<{ bookingId: string; qrCode: string; pdfTicketUrl: string; deskName: string; locationName: string; date: string; timeSlot: string; price: number; }> => {
    const response = await api.post('/desks/book', { holdId });
    return response.data.data;
  },

  // Release a hold
  releaseHold: async (holdId: string): Promise<void> => {
    await api.delete(`/desks/hold/${holdId}`);
  }
}; 