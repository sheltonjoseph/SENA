
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, DollarSign, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Desk {
  id: string;
  name: string;
  type: string;
  time: string;
  price: number;
  rating: number;
  description: string;
  status: string;
}

interface SearchResultsGridProps {
  results: Desk[];
  isLoading: boolean;
}

const SearchResultsGrid = ({ results, isLoading }: SearchResultsGridProps) => {
  const navigate = useNavigate();

  const handleSelect = (desk: Desk) => {
    navigate('/select-seat', { state: { selectedDesk: desk } });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No workspaces found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or explore different locations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Available Workspaces</h3>
        <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
          {results.length} spaces found
        </Badge>
      </div>
      
      <div className="space-y-4">
        {results.map((desk) => (
          <Card 
            key={desk.id} 
            className="group backdrop-blur-sm bg-white/70 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {desk.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge 
                          variant="secondary" 
                          className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
                        >
                          {desk.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-700">{desk.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
                        <DollarSign className="h-5 w-5" />
                        {desk.price}
                      </div>
                      <span className="text-sm text-gray-500">per day</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{desk.time}</span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {desk.description}
                  </p>
                </div>
                
                <div className="lg:w-48">
                  <Button 
                    onClick={() => handleSelect(desk)}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Select Workspace
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsGrid;
