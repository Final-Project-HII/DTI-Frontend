"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Order } from "@/types/order";
import { useOrders } from "@/hooks/useOrder";
import OrderFilter from "./component/AdminOrderFilters";
import OrderTable from "./component/AdminOrdertable";
import OrderStatusModal from "./component/AdminOrderStatusModal";

const AdminOrderManagement = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data: session } = useSession();

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { ordersData, loading, error } = useOrders(
    page,
    size,
    status,
    startDate,
    endDate
  );

  const [localOrdersData, setLocalOrdersData] = useState(ordersData);

  useEffect(() => {
    setLocalOrdersData(ordersData);
  }, [ordersData]);

  const refreshOrders = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleFilterChange = (
    newStatus: string,
    newStartDate: Date | null,
    newEndDate: Date | null
  ) => {
    console.log("Filter changed:", { newStatus, newStartDate, newEndDate });
    setStatus(newStatus);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    console.log("Page changed:", newPage);
    setPage(newPage);
  };

  const handleOrderSelect = (order: Order) => {
    console.log("Order selected:", order);
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleStatusUpdate = useCallback(
    async (orderId: number, newStatus: string) => {
      console.log("Updating status:", { orderId, newStatus });
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/orders/${orderId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user.accessToken}`,
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update order status");
        }

        console.log("Status updated successfully");
        refreshOrders();

        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    },
    [session, selectedOrder, refreshOrders]
  );

  const handlePaymentApproval = useCallback(
    async (orderId: number, isApproved: boolean) => {
      console.log("Approving/Rejecting payment:", { orderId, isApproved });
      try {
        const endpoint = isApproved ? "approve-proof" : "reject-proof";
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/payments/${orderId}/${endpoint}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session?.user.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to ${isApproved ? "approve" : "reject"} payment proof`
          );
        }

        console.log("Payment approval/rejection successful");
        refreshOrders();

        if (selectedOrder && selectedOrder.id === orderId) {
          const newStatus = isApproved ? "confirmation" : "pending_payment";
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } catch (error) {
        console.error("Error handling payment proof:", error);
      }
    },
    [session, selectedOrder, refreshOrders]
  );

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Admin Order Management</h1>
      <OrderFilter onFilterChange={handleFilterChange} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {ordersData && ordersData.data && ordersData.data.content ? (
            <OrderTable
              orders={ordersData.data.content}
              onOrderSelect={handleOrderSelect}
            />
          ) : (
            <div>No orders found</div>
          )}
          <div className="mt-4">{/* Pagination controls */}</div>
        </>
      )}
      {selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusUpdate}
          onPaymentApproval={handlePaymentApproval}
        />
      )}
    </div>
  );
};

export default AdminOrderManagement;
