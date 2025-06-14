import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Desk, DeskAvailability } from "@/types";

interface SelectedSeatSummaryProps {
  selectedDesk: Desk;
  selectedSlot: DeskAvailability;
  searchDate?: Date;
  selectedDate?: Date;
  showMixedResults: boolean;
  onConfirmBooking: () => Promise<void>;
}

const SelectedSeatSummary: React.FC<SelectedSeatSummaryProps> = ({
  selectedDesk,
  selectedSlot,
  searchDate,
  selectedDate,
  showMixedResults,
  onConfirmBooking
}) => {
  return (
    <Card className="backdrop-blur-sm bg-green-50/70 border-2 border-green-200 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-green-800">
              {selectedDesk.name} Selected!
            </h3>
            <p className="text-green-600">
              {selectedSlot.timeSlot ? 
                (showMixedResults 
                  ? `${format(searchDate!, 'PPP')} • ${selectedSlot.timeSlot.label || `${selectedSlot.timeSlot.startTime} - ${selectedSlot.timeSlot.endTime}`}`
                  : `${format(selectedDate!, 'PPP')} • ${selectedSlot.timeSlot.label || `${selectedSlot.timeSlot.startTime} - ${selectedSlot.timeSlot.endTime}`}`
                )
                : 'Time details N/A'
              }
            </p>
            <p className="text-green-700 font-semibold">${selectedSlot.timeSlot ? selectedSlot.timeSlot.price : 'N/A'}</p>
          </div>
          <Button 
            onClick={onConfirmBooking}
            className="bg-green-600 hover:bg-green-700"
          >
            Confirm Booking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedSeatSummary; 