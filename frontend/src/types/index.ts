export interface Location {
  id: string;
  name: string;
  address: string;
  description: string;
  totalDesks: number;
  desks?: Desk[];
}

export interface Desk {
  id: string;
  location_id: string;
  name: string;
  floor: string;
  seat_type: string;
  description: string;
  availability: DeskAvailability[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  label?: string;
}

export interface DeskAvailability {
  id: string;
  desk_id: string;
  date: string;
  time_slot_id: string;
  status: 'available' | 'booked' | 'held';
  timeSlot: TimeSlot;
  holdId?: string;
}