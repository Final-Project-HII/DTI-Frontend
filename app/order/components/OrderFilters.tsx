import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";

interface OrderFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  setDateRange: (startDate: Date | null, endDate: Date | null) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  globalFilter,
  setGlobalFilter,
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

  return (
    <>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Cari transaksimu di sini"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Produk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Produk</SelectItem>
            {/* Add more product categories as needed */}
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => {
            // Implement date range picker logic here
            // For now, let's just set a dummy date range
            setDateRange(new Date(), new Date());
          }}
        >
          <CalendarIcon className="h-4 w-4" />
          Pilih Tanggal Transaksi
        </Button>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {orderStatuses.map((status) => (
          <Button
            key={status}
            variant={status === statusFilter ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status === "all" ? "" : status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
          </Button>
        ))}
        <Button
          variant="link"
          className="text-green-600"
          onClick={() => {
            setGlobalFilter("");
            setStatusFilter("");
            setDateRange(null, null);
          }}
        >
          Reset Filter
        </Button>
      </div>
    </>
  );
};

export default OrderFilters;