import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface OrderFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  setDateRange: (startDate: Date | null, endDate: Date | null) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  setDateRange,
}) => {
  const orderStatuses = [
    "all",
    "pending_payment",
    "confirmation",
    "process",
    "shipped",
    "delivered",
    "cancelled"
  ];

  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <>
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        {orderStatuses.map((status) => (
          <Button
            key={status}
            variant={status === statusFilter ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status === "all" ? "" : status)}
          >
            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
          </Button>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                if (newDate) {
                  const endOfDay = new Date(newDate);
                  endOfDay.setHours(23, 59, 59, 999);
                  setDateRange(newDate, endOfDay);
                } else {
                  setDateRange(null, null);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button
          variant="link"
          className="text-green-600"
          onClick={() => {
            setStatusFilter("");
            setDateRange(null, null);
            setDate(undefined);
          }}
        >
          Reset Filter
        </Button>
      </div>
    </>
  );
};

export default OrderFilters;