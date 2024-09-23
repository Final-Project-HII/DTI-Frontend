import React from "react";
import axios from "axios";
import { Order } from "@/types/order";
import AdminOrderStatusUpdate from "./AdminOrderStatusUpdate";

interface AdminOrderTableProps {
  orders: Order[];
  handleStatusChange: (orderId: number, newStatus: string) => Promise<void>;
}

const AdminOrderTable: React.FC<AdminOrderTableProps> = ({
  orders,
  handleStatusChange,
}) => {
  const handleApprovePayment = async (orderId: number) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/payments/${orderId}/approve-proof`
      );
      alert(response.data); // Optionally show a success message
    } catch (error) {
      alert("Failed to approve payment proof");
      console.error(error);
    }
  };

  const handleRejectPayment = async (orderId: number) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/payments/${orderId}/reject-proof`
      );
      alert(response.data); // Optionally show a success message
    } catch (error) {
      alert("Failed to reject payment proof");
      console.error(error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Order ID</th>
            <th className="px-4 py-2 border">Customer Name</th>
            <th className="px-4 py-2 border">Order Date</th>
            <th className="px-4 py-2 border">Total Amount</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-2 border">{order.id}</td>
              <td className="px-4 py-2 border">{order.userId}</td>
              <td className="px-4 py-2 border">{order.finalAmount}</td>
              <td className="px-4 py-2 border">
                ${order.finalAmount.toFixed(2)}
              </td>
              <td className="px-4 py-2 border">
                <AdminOrderStatusUpdate
                  orderId={order.id}
                  currentStatus={order.status}
                  onStatusChange={handleStatusChange}
                />
              </td>
              <td className="px-4 py-2 border space-x-2">
                {/* Approve Payment Button */}
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => handleApprovePayment(order.id)}
                >
                  Approve Payment
                </button>

                {/* Reject Payment Button */}
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => handleRejectPayment(order.id)}
                >
                  Reject Payment
                </button>

                {/* View Button (Optional) */}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => {
                    // Handle viewing order details
                    alert(`Viewing details for Order ID: ${order.id}`);
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div className="text-center py-4">No orders available.</div>
      )}
    </div>
  );
};

export default AdminOrderTable;
