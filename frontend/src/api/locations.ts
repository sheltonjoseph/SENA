import api from './config';
import { Location } from '@/types';

export const locationApi = {
  // Get all locations
  getAllLocations: async (): Promise<Location[]> => {
    const response = await api.get('/locations');
    return response.data.data;
  },

  // Get location by ID
  getLocationById: async (id: string): Promise<Location> => {
    const response = await api.get(`/locations/${id}`);
    return response.data.data;
  },

  // Get location with desks and availability
  getLocationWithDetails: async (id: string): Promise<Location> => {
    const response = await api.get(`/locations/${id}/details`);
    return response.data.data;
  }
}; 