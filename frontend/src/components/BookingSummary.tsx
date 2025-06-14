
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, DollarSign, Calendar, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface Seat {
  id: string;
  name: string;
  type: string;
  timeSlot: string;
  price: number;
}

interface BookingSummaryProps {
  seat: Seat;
  holdExpiry: Date;
  onConfirm: () => void;
  isConfirmed: boolean;
}

const BookingSummary = ({ seat, holdExpiry, onConfirm, isConfirmed }: BookingSummaryProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = holdExpiry.getTime();
      const difference = expiry - now;
      
      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000));
      } else {
        setTimeLeft(0);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [holdExpiry]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    
    // Placeholder for: POST /desks/confirm {holdId}
    console.log('Confirming booking:', { holdId: seat.id });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onConfirm();
      toast({
        title: "Booking Confirmed!",
        description: "Your workspace reservation is complete",
        duration: 5000,
      });
    }, 1500);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          {isConfirmed ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              Booking Confirmed
            </>
          ) : (
            <>
              <Clock className="h-5 w-5" />
              Booking Summary
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConfirmed && timeLeft > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <p className="text-amber-800 font-medium">
              Hold expires in {formatTime(timeLeft)}
            </p>
            <p className="text-amber-600 text-sm mt-1">
              Complete your booking before the timer runs out
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-slate-800 text-lg">{seat.name}</h3>
              <Badge variant="secondary" className="mt-1">{seat.type}</Badge>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-600">
                <DollarSign className="h-5 w-5" />
                <span className="font-bold text-xl">${seat.price}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Time Slot</p>
                <p className="font-medium text-slate-800">{seat.timeSlot}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Date</p>
                <p className="font-medium text-slate-800">Today</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:col-span-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="font-medium text-slate-800">Downtown Office - Floor 3</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium">${seat.price}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600">Platform Fee</span>
              <span className="font-medium">$2.50</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">Total</span>
              <span className="font-bold text-lg text-slate-800">${seat.price + 2.50}</span>
            </div>
          </div>
        </div>

        {!isConfirmed && (
          <Button 
            onClick={handleConfirm}
            disabled={timeLeft === 0 || isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirming Booking...
              </div>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Booking
              </>
            )}
          </Button>
        )}

        {timeLeft === 0 && !isConfirmed && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800 font-medium">Hold has expired</p>
            <p className="text-red-600 text-sm mt-1">
              Please return to seat selection to make a new reservation
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
