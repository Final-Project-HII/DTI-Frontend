import React from "react";
import { Order } from "@/types/order";
import { PaymentStatus } from "@/types/payment";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderTableProps {
  orders: Order[];
  onOrderSelect: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onOrderSelect }) => {
  return (
    <ScrollArea className="w-full">
      <div className="min-w-max">
        <table className="w-full bg-white">
          <thead>
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
              <tr key={order.id}>
                <td className="border px-4 py-2">{order.id}</td>
                <td className="border px-4 py-2">{order.invoiceId}</td>
                <td className="border px-4 py-2">{order.userId}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">
                  Rp {order.finalAmount.toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  {order.paymentMethod || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {order.warehouseName || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  <Button
                    onClick={() => onOrderSelect(order)}
                    variant="default"
                    size="sm"
                  >
                    Manage
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

export default OrderTable;
