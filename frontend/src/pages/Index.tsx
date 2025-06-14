import { useState, useEffect } from "react";
import { Computer } from "lucide-react";
import { format } from "date-fns";
import { locations as mockLocations, getDesksByLocation as mockGetDesksByLocation, getDeskAvailability as mockGetDeskAvailability, desks as mockDesks, timeSlots as mockTimeSlotsData } from "@/data/deskInventory";
import { locationApi, deskApi, timeSlotApi } from "@/api";
import PlanMyDayForm from "@/components/PlanMyDayForm";
import HeroSection from "@/components/home/HeroSection";
import QuickSearchSection from "@/components/home/QuickSearchSection";
import SelectedSeatSummary from "@/components/home/SelectedSeatSummary";
import type { Location, Desk, TimeSlot, DeskAvailability } from "@/types";
import { useLocation, useNavigate } from 'react-router-dom';

const Index = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<DeskAvailability | null>(null);
  const [formattedTimeSlots, setFormattedTimeSlots] = useState<{ value: string; label: string; }[]>([]);

  // Search functionality
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [searchDate, setSearchDate] = useState<Date>();
  const [searchTimeSlot, setSearchTimeSlot] = useState<string>(''); // New state for time slot in quick search
  const [showMixedResults, setShowMixedResults] = useState<boolean>(false);
  const [mixedResults, setMixedResults] = useState<{ desk: Desk; slot: DeskAvailability }[]>([]);

  const navigate = useNavigate();

  // Fetch locations and time slots on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedLocations = await locationApi.getAllLocations();
        setLocations(fetchedLocations);

        const fetchedTimeSlots = await timeSlotApi.getAllTimeSlots();
        setFormattedTimeSlots(fetchedTimeSlots.map(slot => ({
          value: slot.id,
          label: slot.label || `${slot.startTime} - ${slot.endTime}`
        })));

      } catch (error) {
        console.error('Error fetching initial data:', error);
        // Fallback to mock data if API fails
        setLocations(mockLocations);
        setFormattedTimeSlots(mockTimeSlotsData.map(slot => ({
          value: slot.id,
          label: slot.label || `${slot.startTime} - ${slot.endTime}`
        })));
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchLocation || !searchDate || !searchTimeSlot) return;
    
    try {
      const searchDateString = format(searchDate, 'yyyy-MM-dd');
      console.log('Search Date String:', searchDateString);
      console.log('Search Time Slot:', searchTimeSlot);

      const locationDetails = await locationApi.getLocationWithDetails(searchLocation);
      console.log('Fetched Location Details:', locationDetails);

      const allRelevantSlots: { desk: Desk; slot: DeskAvailability }[] = [];

      if (locationDetails.desks) {
        locationDetails.desks.forEach(desk => {
          console.log('Processing Desk:', desk.id, desk.name);
          console.log('Desk Availability:', desk.availability);

          const relevantAvailability = desk.availability.find(da => 
            da.date === searchDateString && 
            da.time_slot_id === searchTimeSlot
          );

          if (relevantAvailability) {
            console.log('Found Relevant Availability:', relevantAvailability);
            allRelevantSlots.push({
              desk,
              slot: relevantAvailability
            });
          }
        });
      } else {
        console.log('No desks found for location:', searchLocation);
      }

      console.log('Final All Relevant Slots:', allRelevantSlots);

      // const sortedResults = allRelevantSlots.sort((a, b) => 
      //   a.slot.timeSlot.startTime.localeCompare(b.slot.timeSlot.startTime)
      // );

      setMixedResults(allRelevantSlots);
      setShowMixedResults(true);
      setSelectedDesk(null); // Clear previous selection on new search
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error searching desks:', error);
      // Fallback to mock data if API fails
      const searchDateString = format(searchDate, 'yyyy-MM-dd');
      const desksInLocation = mockDesks.filter(desk => desk.location_id === searchLocation); // Get mock desks for location

      const allRelevantSlots: { desk: Desk; slot: DeskAvailability }[] = [];
      
      if (desksInLocation) {
        desksInLocation.forEach(desk => {
          // In mock data, desk.availability is empty, so we use mockGetDeskAvailability
          const deskAvailabilities = mockGetDeskAvailability(desk.id, searchDateString);
          const relevantSlot = deskAvailabilities.find(da => da.time_slot_id === searchTimeSlot);
          
          if (relevantSlot) {
            allRelevantSlots.push({
              desk,
              slot: relevantSlot
            });
          }
        });
      }
      
      const sortedResults = allRelevantSlots
        .sort((a, b) => a.slot.timeSlot.startTime.localeCompare(b.slot.timeSlot.startTime));

      setMixedResults(sortedResults);
      setShowMixedResults(true);
      setSelectedDesk(null);
      setSelectedSlot(null);
    }
  };

  const handleSeatSelect = async (desk: Desk, slot: DeskAvailability) => {
    if (slot.status === 'booked' || slot.status === 'held') {
      alert('This seat is already booked or on hold.');
      return;
    }

    // If a seat was previously selected and held by the current user, release that hold.
    if (selectedDesk && selectedSlot && selectedSlot.holdId) {
      try {
        await deskApi.releaseHold(selectedSlot.holdId);
        console.log(`Hold released for previous seat: ${selectedDesk.name}`);
        // Optionally, update the status of the previously held seat in mixedResults to 'available'
        setMixedResults(prevResults =>
          prevResults.map(item =>
            item.desk.id === selectedDesk.id && item.slot.id === selectedSlot.id
              ? { ...item, slot: { ...item.slot, status: 'available', holdId: undefined } } : item
          )
        );
      } catch (error) {
        console.error('Error releasing previous hold:', error);
        // Continue even if releasing previous hold fails, to allow holding the new seat
      }
    }

    // Clear any previous selection before attempting to hold a new seat
    setSelectedDesk(null);
    setSelectedSlot(null);

    // Attempt to hold the new seat immediately upon selection
    try {
      const response = await deskApi.holdDesk(
        desk.id,
        slot.time_slot_id,
        format(searchDate!, 'yyyy-MM-dd')
      );
      console.log('Seat held successfully upon selection:', response);

      // Update the status in mixedResults to reflect the hold for the current user
      setMixedResults(prevResults => 
        prevResults.map(item => 
          item.desk.id === desk.id && item.slot.id === slot.id
            ? { ...item, slot: { ...item.slot, status: 'held', holdId: response.holdId } } : item
        )
      );

      setSelectedDesk(desk); // Set the selected desk
      setSelectedSlot({ ...slot, status: 'held', holdId: response.holdId }); // Store holdId with selectedSlot
      alert(`Seat ${desk.name} held! Hold ID: ${response.holdId}, Expires At: ${new Date(response.expiresAt).toLocaleTimeString()}`);

    } catch (error) {
      console.error('Error holding seat upon selection:', error);
      alert('Failed to hold seat. Please try again.');
      // Optionally, revert selection if hold fails
      setSelectedDesk(null);
      setSelectedSlot(null);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedDesk || !selectedSlot || !searchDate) return; // All required for booking

    console.log('Initiating booking API call for:', { selectedDesk, selectedSlot });
    
    const holdId = selectedSlot.holdId; // Use the holdId stored in selectedSlot

    if (!holdId) {
      console.error('Error: holdId is missing for booking.');
      alert('Failed to confirm booking: Hold ID is missing. Please re-select your seat.');
      return;
    }

    try {
      const response = await deskApi.bookDesk(holdId);
      console.log('Desk booked successfully:', response);
      // Update the status in mixedResults to reflect the booking
      setMixedResults(prevResults => 
        prevResults.map(item => 
          item.desk.id === selectedDesk.id && item.slot.id === selectedSlot.id
            ? { ...item, slot: { ...item.slot, status: 'booked' } } : item
        )
      );
      alert(`Booking confirmed! Booking ID: ${response.bookingId}`);
      
      // Navigate to confirmation page with booking details
      navigate('/confirmation', {
        state: {
          bookingId: response.bookingId,
          qrCode: response.qrCode, // Assuming API returns a QR code string
          pdfTicketUrl: response.pdfTicketUrl, // Assuming API returns a PDF URL
          deskName: selectedDesk.name,
          locationName: locations.find(loc => loc.id === selectedDesk.location_id)?.name || 'N/A',
          date: format(searchDate!, 'yyyy-MM-dd'),
          timeSlot: `${selectedSlot.timeSlot.startTime} - ${selectedSlot.timeSlot.endTime}`,
          price: selectedSlot.timeSlot.price
        }
      });

      // Clear selection after successful booking
      setSelectedDesk(null);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error booking desk:', error);
      alert('Failed to confirm booking. Please try again.');
    }
  };

  const getSeatStatusColor = (slot: DeskAvailability) => {
    // If the currently selected desk/slot matches THIS slot AND its status is held,
    // then it's the seat held by the current user (green).
    if (selectedDesk?.id === slot.desk_id && selectedSlot?.id === slot.id && selectedSlot.status === 'held') {
      return 'bg-green-500 border-2 border-green-600 cursor-pointer'; 
    } else if (slot.status === 'booked') {
      return 'bg-gray-200 border-2 border-gray-300 cursor-not-allowed opacity-60'; 
    } else if (slot.status === 'held') { 
      // If status is 'held' but it's NOT the current user's selection (meaning it was held by another user),
      // then show it as red.
      return 'bg-red-200 border-2 border-red-300 cursor-not-allowed opacity-60'; 
    } else {
      return 'bg-white border-2 border-gray-300 hover:border-blue-400 cursor-pointer';
    }
  };

  const getSeatIcon = (slot: DeskAvailability) => {
    if (selectedDesk?.id === slot.desk_id && selectedSlot?.id === slot.id && selectedSlot.status === 'held') {
      return <Computer className="h-6 w-6 text-white" />;
    } else if (slot.status === 'held') { 
      return <Computer className="h-6 w-6 text-red-600" />;
    }
    return <Computer className="h-6 w-6 text-gray-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="relative container mx-auto px-6 py-16">
          <HeroSection />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Left Column - Search & Desks List */}
            <div className="xl:col-span-2 space-y-8">
              <QuickSearchSection
                locations={locations}
                searchLocation={searchLocation}
                setSearchLocation={setSearchLocation}
                searchDate={searchDate}
                setSearchDate={setSearchDate}
                searchTimeSlot={searchTimeSlot}
                setSearchTimeSlot={setSearchTimeSlot}
                timeSlots={formattedTimeSlots}
                onSearch={handleSearch}
              />

              {/* Desks List (Mixed Results section repurposed) */}
              {showMixedResults && (mixedResults.length > 0) ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
                  {mixedResults.map(({ desk, slot }) => (
                    <div
                      key={`${desk.id}-${slot.id}`}
                      onClick={() => handleSeatSelect(desk, slot)}
                      className={`relative p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${getSeatStatusColor(slot)}`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {getSeatIcon(slot)}
                        <div className="text-center">
                          <div className="font-medium text-sm">{desk.name}</div>
                          <div className="text-xs text-gray-500">Floor {desk.floor}</div>
                          <div className="text-xs text-blue-600 font-semibold">
                            {slot.timeSlot.startTime} - {slot.timeSlot.endTime}
                          </div>
                          <div className="text-xs font-semibold text-green-600">
                            ${slot.timeSlot.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : showMixedResults && (
                <div className="p-6 text-center text-gray-500">
                  No desks available for the selected criteria.
                </div>
              )}

              {/* Selected Seat Summary (only show if a seat is selected) */}
              {selectedDesk && selectedSlot && (
                <SelectedSeatSummary
                  selectedDesk={selectedDesk}
                  selectedSlot={selectedSlot}
                  searchDate={searchDate}
                  selectedDate={searchDate}
                  showMixedResults={showMixedResults}
                  onConfirmBooking={handleConfirmBooking} // Updated prop name
                />
              )}
            </div>
            
            {/* Right Column - AI Planner */}
            <div className="xl:sticky xl:top-8 xl:h-fit">
              <PlanMyDayForm
                locations={locations}
                searchLocation={searchLocation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
