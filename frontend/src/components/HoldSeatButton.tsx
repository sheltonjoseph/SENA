
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Seat {
  id: string;
  name: string;
  type: string;
  timeSlot: string;
  price: number;
  status: 'available' | 'held' | 'booked';
}

interface HoldSeatButtonProps {
  seat: Seat;
  onStatusChange: (seatId: string, newStatus: 'available' | 'held' | 'booked') => void;
  disabled: boolean;
}

const HoldSeatButton = ({ seat, onStatusChange, disabled }: HoldSeatButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleHold = async () => {
    setIsLoading(true);
    
    // Placeholder for: POST /desks/hold {slotId, userEmail}
    console.log('Holding seat:', { 
      slotId: seat.id, 
      userEmail: 'user@example.com' // This would come from auth context
    });

    // Simulate API call
    setTimeout(() => {
      onStatusChange(seat.id, 'held');
      setIsLoading(false);
      
      toast({
        title: "Seat Reserved!",
        description: `${seat.name} is held for 3 minutes`,
        duration: 5000,
      });

      // Navigate to confirmation with seat data
      navigate('/confirmation', { 
        state: { 
          heldSeat: seat,
          holdExpiry: new Date(Date.now() + 3 * 60 * 1000) // 3 minutes from now
        }
      });
    }, 1000);
  };

  const getButtonContent = () => {
    if (disabled) {
      if (seat.status === 'held') {
        return (
          <>
            <Clock className="mr-2 h-4 w-4" />
            On Hold
          </>
        );
      }
      if (seat.status === 'booked') {
        return (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Booked
          </>
        );
      }
    }

    if (isLoading) {
      return (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Holding...
        </>
      );
    }

    return (
      <>
        <Clock className="mr-2 h-4 w-4" />
        Hold for 3 min
      </>
    );
  };

  const getButtonVariant = () => {
    if (seat.status === 'held') return 'secondary';
    if (seat.status === 'booked') return 'destructive';
    return 'default';
  };

  return (
    <Button 
      onClick={handleHold}
      disabled={disabled || isLoading}
      variant={getButtonVariant()}
      className="w-full transition-all duration-200"
    >
      {getButtonContent()}
    </Button>
  );
};

export default HoldSeatButton;
