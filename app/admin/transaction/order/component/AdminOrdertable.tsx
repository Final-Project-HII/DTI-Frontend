import React from "react";
import { Order } from "@/types/order";
import AdminOrderStatusUpdate from "./AdminOrderStatusUpdate";

interface OrderTableProps {
  orders: Order[];
  onOrderSelect: (order: Order) => void;
  onStatusChange: (orderId: number, newStatus: string) => Promise<void>;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onOrderSelect,
  onStatusChange,
}) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Invoice ID</th>
          <th className="px-4 py-2">User ID</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Total Amount</th>
          <th className="px-4 py-2">Payment Method</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="border px-4 py-2">{order.id}</td>
            <td className="border px-4 py-2">{order.invoiceId}</td>
            <td className="border px-4 py-2">{order.userId}</td>
            <td className="border px-4 py-2">
              <AdminOrderStatusUpdate
                orderId={order.id}
                currentStatus={order.status}
                onStatusChange={onStatusChange}
              />
            </td>
            <td className="border px-4 py-2">
              Rp {order.finalAmount.toLocaleString()}
            </td>
            {/* <td className="border px-4 py-2">{payment.paymentMethod}</td> */}
            <td className="border px-4 py-2">
              <button
                onClick={() => onOrderSelect(order)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              >
                Manage
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
