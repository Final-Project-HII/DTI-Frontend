import React from "react";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { MoreVertical, Package } from "lucide-react";
import OrderItemsModal from "./AdminOrderItemModal";

interface OrderTableProps {
  orders: Order[];
  onOrderSelect: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onOrderSelect }) => {
  const formatPaymentMethod = (method: string | null | undefined) => {
    if (!method) return "N/A";
    return method.toLowerCase().replace(/_/g, " ");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending_payment": return "bg-yellow-100 text-yellow-800";
      case "confirmation": return "bg-blue-100 text-blue-800";
      case "process": return "bg-purple-100 text-purple-800";
      case "shipped": return "bg-indigo-100 text-indigo-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodColor = (method: string | null | undefined) => {
    if (!method) return "bg-gray-100 text-gray-800";
    switch (method.toLowerCase()) {
      case "payment_gateway": return "bg-teal-100 text-teal-800";
      case "payment_proof": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1000px] bg-white shadow-lg rounded-lg text-center">
        <thead className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Invoice ID</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Total Amount</th>
            <th className="px-4 py-2">Payment Method</th>
            <th className="px-4 py-2">Warehouse</th>
            <th className="px-4 py-2">Items</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-100 transition-colors duration-200">
              <td className="border-b px-4 py-2">{order.id}</td>
              <td className="border-b px-4 py-2">{order.invoiceId}</td>
              <td className="border-b px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="border-b px-4 py-2">Rp {order.finalAmount.toLocaleString()}</td>
              <td className="border-b px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getPaymentMethodColor(order.paymentMethod)}`}>
                  {formatPaymentMethod(order.paymentMethod)}
                </span>
              </td>
              <td className="border-b px-4 py-2">{order.warehouseName}</td>
              <td className="border-b px-4 py-2">
                <OrderItemsModal items={order.items}>
                  <Button variant="outline" size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    {order.items.length} item(s)
                  </Button>
                </OrderItemsModal>
              </td>
              <td className="border-b px-4 py-2">
                <Button onClick={() => onOrderSelect(order)} variant="ghost" size="sm" className="p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;