import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Brain, MapPin, Sparkles, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Location } from "@/types";
import { dayPlanApi } from "@/api";

interface PlanMyDayFormProps {
  locations: Location[];
  searchLocation: string;
}

const PlanMyDayForm = ({ locations, searchLocation }: PlanMyDayFormProps) => {
  const [location, setLocation] = useState<string>(searchLocation || "");
  const [date, setDate] = useState<Date>();
  const [vibe, setVibe] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);

  useEffect(() => {
    if (searchLocation) {
      setLocation(searchLocation);
    }
  }, [searchLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !date || !vibe) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to plan your day",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setItinerary(null);
    
    try {
      const formattedDate = format(date!, 'yyyy-MM-dd');
      const response = await dayPlanApi.generateDayPlan(location, formattedDate, vibe);
      setItinerary(response);
      toast({
        title: "Day Planned!",
        description: "Your AI-powered workday itinerary is ready"
      });
    } catch (error) {
      console.error('Error generating day plan:', error);
      toast({
        title: "Planning Failed",
        description: "Could not generate day plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50/80 to-pink-50/80 border-0 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 h-fit">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <Brain className="h-5 w-5 text-white" />
          </div>
          AI Day Planner
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Let AI craft your perfect workday experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-500" />
              Location
            </label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all">
                <SelectValue placeholder="Choose your preferred location" />
              </SelectTrigger>
              <SelectContent className="border-gray-200">
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-purple-500" />
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 w-full justify-start text-left font-normal border-gray-200 hover:border-purple-500 transition-all",
                    !date && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4 text-purple-500" />
                  {date ? format(date, "EEEE, MMMM do, yyyy") : "Select your date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-gray-200 shadow-xl" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Work Vibe
            </label>
            <Select value={vibe} onValueChange={setVibe}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all">
                <SelectValue placeholder="Choose your ideal work atmosphere" />
              </SelectTrigger>
              <SelectContent className="border-gray-200">
                <SelectItem value="focus">🎯 Deep Focus Mode</SelectItem>
                <SelectItem value="networking">🤝 Networking & Collaboration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI is Planning...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5" />
                Plan My Perfect Day
              </div>
            )}
          </Button>
        </form>

        {itinerary && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 pt-2">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent flex-1" />
              <h4 className="text-lg font-bold text-gray-900 px-4">Your AI-Crafted Day</h4>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent flex-1" />
            </div>
            
            <div className="space-y-4">
              {Object.entries(itinerary).map(([period, details]: [string, any], index) => (
                <div key={period} className="relative">
                  <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-gray-900 text-lg capitalize">{period}</h5>
                          <div className="flex items-center gap-1 text-sm text-purple-600 font-medium">
                            <Clock className="h-4 w-4" />
                            {details.time}
                          </div>
                        </div>
                        <p className="font-semibold text-purple-700">{details.activity}</p>
                        <p className="text-sm text-gray-600 font-medium">📍 {details.location}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{details.description}</p>
                      </div>
                    </div>
                  </div>
                  {index < Object.keys(itinerary).length - 1 && (
                    <div className="flex justify-center py-2">
                      <div className="w-px h-8 bg-purple-200" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanMyDayForm;
