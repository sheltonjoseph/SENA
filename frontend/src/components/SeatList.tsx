
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HoldSeatButton from "@/components/HoldSeatButton";
import RealTimeAvailabilityBadge from "@/components/RealTimeAvailabilityBadge";
import { Clock, DollarSign, Star, Users, Wifi, Monitor } from "lucide-react";
import { useState, useEffect } from "react";

interface Seat {
  id: string;
  name: string;
  type: string;
  timeSlot: string;
  price: number;
  status: 'available' | 'held' | 'booked';
  features: string[];
  capacity?: number;
}

interface SeatListProps {
  selectedDesk: any;
}

const SeatList = ({ selectedDesk }: SeatListProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);

  // Mock seat data based on selected desk
  useEffect(() => {
    const mockSeats: Seat[] = [
      {
        id: '1',
        name: `${selectedDesk.name} - Morning Slot`,
        type: selectedDesk.type,
        timeSlot: '9:00 AM - 1:00 PM',
        price: Math.floor(selectedDesk.price * 0.6),
        status: 'available',
        features: ['High-speed WiFi', '4K Monitor', 'Ergonomic Chair'],
        capacity: selectedDesk.type === 'Private Office' ? 4 : undefined
      },
      {
        id: '2',
        name: `${selectedDesk.name} - Afternoon Slot`,
        type: selectedDesk.type,
        timeSlot: '1:00 PM - 5:00 PM',
        price: Math.floor(selectedDesk.price * 0.7),
        status: 'available',
        features: ['High-speed WiFi', '4K Monitor', 'Ergonomic Chair', 'Phone Booth Access'],
        capacity: selectedDesk.type === 'Private Office' ? 4 : undefined
      },
      {
        id: '3',
        name: `${selectedDesk.name} - Full Day`,
        type: selectedDesk.type,
        timeSlot: '9:00 AM - 6:00 PM',
        price: selectedDesk.price,
        status: 'available',
        features: ['High-speed WiFi', '4K Monitor', 'Ergonomic Chair', 'Phone Booth Access', 'Meeting Room Credits'],
        capacity: selectedDesk.type === 'Private Office' ? 4 : undefined
      },
      {
        id: '4',
        name: `${selectedDesk.name} - Evening Slot`,
        type: selectedDesk.type,
        timeSlot: '5:00 PM - 9:00 PM',
        price: Math.floor(selectedDesk.price * 0.5),
        status: Math.random() > 0.7 ? 'held' : 'available',
        features: ['High-speed WiFi', '4K Monitor', 'Ergonomic Chair'],
        capacity: selectedDesk.type === 'Private Office' ? 4 : undefined
      }
    ];
    
    setSeats(mockSeats);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSeats(prev => prev.map(seat => ({
        ...seat,
        status: Math.random() > 0.9 ? 
          (seat.status === 'available' ? 'held' : seat.status === 'held' ? 'available' : seat.status) 
          : seat.status
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedDesk]);

  const handleSeatUpdate = (seatId: string, newStatus: 'available' | 'held' | 'booked') => {
    setSeats(prev => prev.map(seat => 
      seat.id === seatId ? { ...seat, status: newStatus } : seat
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {seats.map((seat) => (
          <Card 
            key={seat.id} 
            className="hover:shadow-lg transition-all duration-300 border-0 shadow-md"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 text-lg mb-2">
                    {seat.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{seat.type}</Badge>
                    <RealTimeAvailabilityBadge status={seat.status} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-bold text-lg">${seat.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm">{selectedDesk.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600 mb-4">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{seat.timeSlot}</span>
              </div>

              {seat.capacity && (
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Up to {seat.capacity} people</span>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {seat.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {feature.includes('WiFi') && <Wifi className="h-3 w-3" />}
                      {feature.includes('Monitor') && <Monitor className="h-3 w-3" />}
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <HoldSeatButton 
                seat={seat} 
                onStatusChange={handleSeatUpdate}
                disabled={seat.status !== 'available'}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SeatList;
