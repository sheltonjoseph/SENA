
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";

interface RealTimeAvailabilityBadgeProps {
  status: 'available' | 'held' | 'booked';
}

const RealTimeAvailabilityBadge = ({ status }: RealTimeAvailabilityBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          label: 'Available',
          className: 'bg-green-100 text-green-800 border-green-200',
          iconColor: 'text-green-500'
        };
      case 'held':
        return {
          label: 'Held',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          iconColor: 'text-yellow-500'
        };
      case 'booked':
        return {
          label: 'Booked',
          className: 'bg-red-100 text-red-800 border-red-200',
          iconColor: 'text-red-500'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          iconColor: 'text-gray-500'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge className={`${config.className} animate-pulse`}>
      <Circle className={`h-2 w-2 mr-1 fill-current ${config.iconColor}`} />
      {config.label}
    </Badge>
  );
};

export default RealTimeAvailabilityBadge;
