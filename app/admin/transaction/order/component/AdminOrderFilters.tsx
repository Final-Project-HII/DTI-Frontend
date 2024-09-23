import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

interface AdminOrderFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dateRange: { startDate: Date | null; endDate: Date | null };
  setDateRange: (range: { startDate: Date | null; endDate: Date | null }) => void;
}

const AdminOrderFilters: React.FC<AdminOrderFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Input
        placeholder="Search orders..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-xs"
      />
      <Select value={statusFilter || "all"} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending_payment">Pending Payment</SelectItem>
          <SelectItem value="confirmation">Confirmation</SelectItem>
          <SelectItem value="process">Process</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => {
          // Implement date range picker logic here
          setDateRange({
            startDate: new Date(),
            endDate: new Date(),
          });
        }}
      >
        <CalendarIcon className="h-4 w-4" />
        Select Date Range
      </Button>
    </div>
  );
};

export default AdminOrderFilters;
