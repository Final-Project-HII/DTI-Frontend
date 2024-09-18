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
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  globalFilter,
  setGlobalFilter,
  statusFilter,
  setStatusFilter,
}) => (
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
      <Button variant="outline" className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        Pilih Tanggal Transaksi
      </Button>
    </div>
    <div className="flex gap-2 mb-4">
      {[
        "Semua",
        "PENDING_PAYMENT",
        "PAYMENT_SUCCESS",
        "CONFIRMATION",
        "PROCESS",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ].map((status) => (
        <Button
          key={status}
          variant={status === statusFilter ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter(status)}
        >
          {status}
        </Button>
      ))}
      <Button
        variant="link"
        className="text-green-600"
        onClick={() => {
          setGlobalFilter("");
          setStatusFilter("Semua");
        }}
      >
        Reset Filter
      </Button>
    </div>
  </>
);

export default OrderFilters;
