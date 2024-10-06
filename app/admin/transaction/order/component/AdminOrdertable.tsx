import React from "react";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical } from "lucide-react";

interface OrderTableProps {
  orders: Order[];
  onOrderSelect: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onOrderSelect }) => {
  return (
    <ScrollArea className="w-full h-[450px] overflow-hidden bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out">
      <div className="min-w-max">
        <table className="w-full">
          <thead className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Invoice ID</th>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Payment Method</th>
              <th className="px-4 py-2">Warehouse</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="border-b px-4 py-2">{order.id}</td>
                <td className="border-b px-4 py-2">{order.invoiceId}</td>
                <td className="border-b px-4 py-2">{order.userId}</td>
                <td className="border-b px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="border-b px-4 py-2">
                  Rp {order.finalAmount.toLocaleString()}
                </td>
                <td className="border-b px-4 py-2">
                  {order.paymentMethod || "N/A"}
                </td>
                <td className="border-b px-4 py-2">
                  {order.warehouseName || "N/A"}
                </td>
                <td className="border-b px-4 py-2">
                  <Button
                    onClick={() => onOrderSelect(order)}
                    variant="ghost"
                    size="sm"
                    className="p-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending_payment":
      return "bg-yellow-100 text-yellow-800";
    case "confirmation":
      return "bg-blue-100 text-blue-800";
    case "process":
      return "bg-purple-100 text-purple-800";
    case "shipped":
      return "bg-indigo-100 text-indigo-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default OrderTable;
