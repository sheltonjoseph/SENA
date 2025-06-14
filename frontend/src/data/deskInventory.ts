import type { Location, Desk, TimeSlot, DeskAvailability } from "@/types";

export interface Desk {
  id: string;
  name: string;
  type: 'Hot Desk' | 'Private Office' | 'Executive' | 'Meeting Room';
  location: string;
  floor: number;
  features: string[];
  pricePerHour: number;
  rating: number;
}

export interface TimeSlot {
  id: string;
  deskId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'selected';
  price: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  description: string;
  totalDesks: number;
  amenities: string[];
}

// Locations
export const locations: Location[] = [
  {
    id: 'downtown',
    name: 'Downtown Innovation Hub',
    address: '123 Business District, Downtown',
    description: 'Premium workspace in the heart of the financial district',
    totalDesks: 20,
  },
  {
    id: 'creative',
    name: 'Creative Co-Space',
    address: '456 Arts Quarter, Midtown',
    description: 'Inspiring environment for creative professionals',
    totalDesks: 18,
  },
  {
    id: 'tech',
    name: 'Tech Innovation Center',
    address: '789 Silicon Valley, Tech District',
    description: 'State-of-the-art facility for tech companies',
    totalDesks: 12,
  }
];

// Generate mock desks for each location to align with the new Desk interface
export const desks: Desk[] = [
  // Downtown Innovation Hub (20 desks)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `downtown-${i + 1}`,
    location_id: 'downtown',
    name: `Desk ${i + 1}`,
    floor: `${Math.floor(i / 10) + 1}`,
    seat_type: ['Hot Desk', 'Private Office', 'Executive', 'Meeting Room'][Math.floor(Math.random() * 4)],
    description: 'A comfortable workspace with modern amenities.',
    availability: [] // Will be populated or fetched
  })),

  // Creative Co-Space (18 desks)
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `creative-${i + 1}`,
    location_id: 'creative',
    name: `Studio ${i + 1}`,
    floor: `${Math.floor(i / 9) + 1}`,
    seat_type: ['Hot Desk', 'Private Office', 'Executive'][Math.floor(Math.random() * 3)],
    description: 'A creative workspace designed for collaboration.',
    availability: []
  })),

  // Tech Innovation Center (12 desks)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `tech-${i + 1}`,
    location_id: 'tech',
    name: `Workstation ${i + 1}`,
    floor: `${Math.floor(i / 6) + 1}`,
    seat_type: ['Hot Desk', 'Private Office', 'Executive'][Math.floor(Math.random() * 3)],
    description: 'A high-tech workstation with advanced features.',
    availability: []
  }))
];

// Fixed time slots as per database structure
export const timeSlots: TimeSlot[] = [
  { id: 'ts1', startTime: '09:00', endTime: '13:00', price: 15, label: 'Morning (9AM - 1PM)' },
  { id: 'ts2', startTime: '13:00', endTime: '17:00', price: 15, label: 'Afternoon (1PM - 5PM)' },
  { id: 'ts3', startTime: '17:00', endTime: '21:00', price: 12, label: 'Evening (5PM - 9PM)' },
];

// Helper functions (will be updated to use the new mock structure, for fallback)
export const getDesksByLocation = (locationId: string): Desk[] =>
  desks.filter(desk => desk.location_id === locationId);

export const getDeskAvailability = (deskId: string, date: string): DeskAvailability[] => {
  const today = new Date();
  const dateToCheck = new Date(date);
  
  // Simple mock availability for a given desk and date
  const mockAvail: DeskAvailability[] = [];
  timeSlots.forEach(ts => {
    mockAvail.push({
      id: `${deskId}-${date}-${ts.id}`,
      desk_id: deskId,
      date: date,
      time_slot_id: ts.id,
      status: Math.random() > 0.5 ? 'available' : 'booked', // Random status for mock
      timeSlot: ts
    });
  });
  return mockAvail;
};
