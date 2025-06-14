import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Location } from "@/types";

interface QuickSearchSectionProps {
  locations: Location[];
  searchLocation: string;
  setSearchLocation: (location: string) => void;
  searchDate: Date | undefined;
  setSearchDate: (date: Date | undefined) => void;
  searchTimeSlot: string;
  setSearchTimeSlot: (slot: string) => void;
  timeSlots: { value: string; label: string; }[];
  onSearch: () => void;
}

const QuickSearchSection: React.FC<QuickSearchSectionProps> = ({
  locations,
  searchLocation,
  setSearchLocation,
  searchDate,
  setSearchDate,
  searchTimeSlot,
  setSearchTimeSlot,
  timeSlots,
  onSearch
}) => {
  return (
    <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
          <Search className="h-6 w-6 text-blue-500" />
          Quick Search
        </CardTitle>
        <CardDescription>
          Search across all locations for available seats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Location</label>
            <Select value={searchLocation} onValueChange={setSearchLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !searchDate && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchDate ? format(searchDate, "MMM dd") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={searchDate}
                  onSelect={setSearchDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Time Slot</label>
            <Select value={searchTimeSlot} onValueChange={setSearchTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end md:col-span-1">
            <Button 
              onClick={onSearch}
              disabled={!searchLocation || !searchDate || !searchTimeSlot}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Search
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickSearchSection; 