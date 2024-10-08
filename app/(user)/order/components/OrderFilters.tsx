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
            {status === "all"
              ? "All"
              : status.charAt(0).toUpperCase() +
                status.slice(1).replace("_", " ")}
          </Button>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(newDate) => {
                setSelectedDate(newDate);
                setDate(newDate ?? null); // Convert undefined to null for parent component
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
            setDate(null);
            setSelectedDate(undefined);
          }}
        >
          Reset Filter
        </Button>
      </div>
    </>
  );
};

export default OrderFilters;
