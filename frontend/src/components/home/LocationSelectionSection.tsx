import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Wifi, Coffee } from "lucide-react";
import { Location } from "@/types";

interface LocationSelectionSectionProps {
  locations: Location[];
  selectedLocation: string;
  onLocationSelect: (locationId: string) => void;
}

const LocationSelectionSection: React.FC<LocationSelectionSectionProps> = ({
  locations,
  selectedLocation,
  onLocationSelect
}) => {
  return (
    <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
          <MapPin className="h-6 w-6 text-blue-500" />
          Choose Your Location
        </CardTitle>
        <CardDescription>
          Select from our premium coworking spaces
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations.map((location) => (
            <Card
              key={location.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedLocation === location.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => onLocationSelect(location.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.address}</p>
                  <p className="text-sm text-gray-500">{location.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {location.totalDesks} desks
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="h-3 w-3" />
                      <Wifi className="h-3 w-3" />
                      <Coffee className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSelectionSection; 