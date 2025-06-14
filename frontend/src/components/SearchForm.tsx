
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, MapPin, Search, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  onSearch: (location: string, date: string) => void;
  isLoading: boolean;
}

const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [location, setLocation] = useState<string>("");
  const [date, setDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && date) {
      onSearch(location, format(date, 'yyyy-MM-dd'));
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-500">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Search className="h-5 w-5 text-white" />
          </div>
          Search Workspaces
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Discover premium workspaces tailored to your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              Location
            </label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                <SelectValue placeholder="Choose your preferred location" />
              </SelectTrigger>
              <SelectContent className="border-gray-200">
                <SelectItem value="downtown">Downtown Financial District</SelectItem>
                <SelectItem value="midtown">Midtown Creative Hub</SelectItem>
                <SelectItem value="uptown">Uptown Business Center</SelectItem>
                <SelectItem value="tech-district">Tech Innovation Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-blue-500" />
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 w-full justify-start text-left font-normal border-gray-200 hover:border-blue-500 transition-all",
                    !date && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4 text-blue-500" />
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

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            disabled={!location || !date || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Searching Premium Spaces...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5" />
                Find Perfect Workspace
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
