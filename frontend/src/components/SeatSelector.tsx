import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Computer, Check } from "lucide-react";
import { useState } from "react";
import type { Desk, DeskAvailability, TimeSlot } from "@/types";

interface SeatSelectorProps {
  desks: Desk[];
  slots: DeskAvailability[];
  selectedDate: string;
  selectedTimeSlot: string;
  onSeatSelect: (desk: Desk, slot: DeskAvailability) => void;
}

const SeatSelector = ({ desks, slots, selectedDate, selectedTimeSlot, onSeatSelect }: SeatSelectorProps) => {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  const getSlotForDesk = (deskId: string) => {
    return slots.find(slot => 
      slot.desk_id === deskId && 
      slot.date === selectedDate && 
      slot.time_slot_id === selectedTimeSlot
    );
  };

  const handleSeatClick = (desk: Desk) => {
    const slot = getSlotForDesk(desk.id);
    if (!slot || slot.status === 'booked') return;

    // Simplified status update for demonstration. In a real app, you'd call an API.
    if (slot.status === 'available') {
      // Clear other selections and select this one
      selectedSlots.forEach(slotId => {
        const previouslySelectedSlot = slots.find(s => s.id === slotId);
        if (previouslySelectedSlot) {
          // Simulate updating status back to available
          // mockUpdateSlotStatus(slotId, 'available'); // If you want to use the mock for visual update
        }
      });
      setSelectedSlots(new Set([slot.id]));
      // Simulate updating status to selected
      // mockUpdateSlotStatus(slot.id, 'selected'); // If you want to use the mock for visual update
      onSeatSelect(desk, slot);
    } else if (slot.status === 'held') {
      // Deselect
      setSelectedSlots(new Set());
      // mockUpdateSlotStatus(slot.id, 'available'); // If you want to use the mock for visual update
    }
  };

  const getSeatStatusColor = (desk: Desk) => {
    const slot = getSlotForDesk(desk.id);
    if (!slot) return 'bg-gray-200';
    
    switch (slot.status) {
      case 'available':
        return 'bg-white border-2 border-gray-300 hover:border-blue-400 cursor-pointer';
      case 'held':
        return 'bg-green-500 border-2 border-green-600 cursor-pointer';
      case 'booked':
        return 'bg-red-200 border-2 border-red-300 cursor-not-allowed';
      default:
        return 'bg-gray-200';
    }
  };

  const getSeatIcon = (desk: Desk) => {
    const slot = getSlotForDesk(desk.id);
    if (slot?.status === 'held') {
      return <Check className="h-6 w-6 text-white" />;
    }
    return <Computer className="h-6 w-6 text-gray-600" />;
  };

  return (
    <Card className="col-span-2 backdrop-blur-sm bg-white/70 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
          <Computer className="h-6 w-6 text-blue-500" />
          Select Your Seat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
          {desks.map((desk) => {
            const slot = getSlotForDesk(desk.id);
            return (
              <div
                key={desk.id}
                onClick={() => handleSeatClick(desk)}
                className={`
                  relative p-4 rounded-xl transition-all duration-300 transform hover:scale-105
                  ${getSeatStatusColor(desk)}
                  ${slot?.status === 'booked' ? 'opacity-60' : ''}
                `}
              >
                <div className="flex flex-col items-center space-y-2">
                  {getSeatIcon(desk)}
                  <div className="text-center">
                    <div className="font-medium text-sm">{desk.name}</div>
                    <div className="text-xs text-gray-500">Floor {desk.floor}</div>
                    {slot && (
                      <div className="text-xs font-semibold text-green-600">
                        ${slot.timeSlot.price}
                      </div>
                    )}
                  </div>
                  
                  {slot?.status === 'booked' && (
                    <Badge variant="destructive" className="text-xs">
                      Booked
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeatSelector;
