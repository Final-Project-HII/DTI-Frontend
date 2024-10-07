import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "lodash";

interface Warehouse {
  id: number;
  name: string;
}

interface OrderFilterProps {
  onFilterChange: (
    status: string,
    warehouseId: string,
    date: string
  ) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState("ALL");
  const [warehouseId, setWarehouseId] = useState("ALL");
  const [date, setDate] = useState<string>("");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const { data: session } = useSession();

  const debouncedFilterChange = useCallback(
    debounce((status, warehouseId, date) => {
      onFilterChange(
        status,
        warehouseId === "ALL" ? "" : warehouseId,
        date
      );
    }, 300),
    [onFilterChange]
  );

  useEffect(() => {
    const fetchWarehouses = async () => {
      if (!session?.user.accessToken) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/warehouses`,
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const warehouseArray = data.data?.content || [];
          setWarehouses(warehouseArray);
        } else {
          console.error("Failed to fetch warehouses:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };

    fetchWarehouses();
  }, [session]);

  useEffect(() => {
    debouncedFilterChange(status, warehouseId, date);
  }, [status, warehouseId, date, debouncedFilterChange]);

  const handleReset = () => {
    setStatus("ALL");
    setWarehouseId("ALL");
    setDate("");
    onFilterChange("ALL", "", "");
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
            <SelectItem value="CONFIRMATION">Confirmation</SelectItem>
            <SelectItem value="PROCESS">Process</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={warehouseId} onValueChange={setWarehouseId}>
          <SelectTrigger>
            <SelectValue placeholder="Select Warehouse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Warehouses</SelectItem>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleReset}
          variant="outline"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default OrderFilter;