import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Warehouse {
  id: number;
  name: string;
}

interface OrderFilterProps {
  onFilterChange: (
    status: string,
    warehouseId: string,
    startDate: string,
    endDate: string
  ) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState("all");
  const [warehouseId, setWarehouseId] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchWarehouses = async () => {
      if (!session?.user.accessToken) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/warehouses`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Warehouse data:', data);
          // Extract warehouses from the nested structure
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(status, warehouseId, startDate, endDate);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex items-center space-x-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All Status</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="confirmation">Confirmation</option>
          <option value="process">Process</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">All Warehouses</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id.toString()}>
              {warehouse.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default OrderFilter;