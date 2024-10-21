import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { format, startOfDay, endOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface OrderFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  setDate: (date: Date | null) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  setDate,
}) => {
  const orderStatuses = [
    "all",
    "pending_payment",
    "confirmation",
    "process",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (newDate) {
      const startDate = startOfDay(newDate);
      setDate(startDate);
    } else {
      setDate(null);
    }
  };

  return (
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {orderStatuses.map((status) => (
          <Button
            key={status}
            variant={status === statusFilter ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status === "all" ? "" : status)}
            className="mb-2 sm:mb-0"
          >
            {status === "all"
              ? "All"
              : status.charAt(0).toUpperCase() +
                status.slice(1).replace("_", " ")}
          </Button>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          size="sm"
          className="text-gray-600"
          onClick={() => {
            setStatusFilter("");
            setDate(null);
            setSelectedDate(undefined);
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Filter
        </Button>
      </div>
    </div>
  );
};

export default OrderFilters;