
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SeatList from "@/components/SeatList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SelectSeat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDesk = location.state?.selectedDesk;

  useEffect(() => {
    if (!selectedDesk) {
      navigate('/');
    }
  }, [selectedDesk, navigate]);

  if (!selectedDesk) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Select Your Seat
            </h1>
            <p className="text-slate-600">
              Choose from available seats for {selectedDesk.name}
            </p>
          </div>
        </div>

        <SeatList selectedDesk={selectedDesk} />
      </div>
    </div>
  );
};

export default SelectSeat;
