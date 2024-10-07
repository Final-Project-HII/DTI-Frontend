"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Order } from "@/types/order";
import { PaymentStatus } from "@/types/payment";
import OrderFilter from "./component/AdminOrderFilters";
import OrderTable from "./component/AdminOrdertable";
import OrderStatusModal from "./component/AdminOrderStatusModal";
import AdminOrderPagination from "./component/AdminOrderPagination";
import { useRouter } from "next/navigation";

import OrderTableSkeleton from "./component/AdminOrderTableSkeleton";
import { useAdminOrders } from "@/hooks/useAdminOrders";

const AdminOrderManagement = () => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [orderStatus, setOrderStatus] = useState("all");
  const [warehouseId, setWarehouseId] = useState("");
  const [date, setDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [payments, setPayments] = useState<PaymentStatus[]>([]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { ordersData, loading, error } = useAdminOrders(
    page,
    size,
    orderStatus,
    warehouseId,
    date
  );

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    } else if (
      sessionStatus === "authenticated" &&
      session?.user?.role !== "ADMIN"
    ) {
      router.push("/unauthorized");
    }
  }, [sessionStatus, session, router]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (ordersData && ordersData.data && ordersData.data.content) {
        const orderIds = ordersData.data.content.map((order) => order.id);
        try {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL
            }api/payments/status?orderIds=${orderIds.join(",")}`,
            {
              headers: { Authorization: `Bearer ${session?.user.accessToken}` },
            }
          );
          if (response.ok) {
            const paymentData = await response.json();
            setPayments(paymentData);
          }
        } catch (error) {
          console.error("Error fetching payment data:", error);
        }
      }
    };

    fetchPayments();
  }, [ordersData, session]);

  const refreshOrders = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleFilterChange = (
    newStatus: string,
    newWarehouseId: string,
    newDate: string
  ) => {
    setOrderStatus(newStatus);
    setWarehouseId(newWarehouseId);
    setDate(newDate);
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1); // Adjust for 0-based index
  };

  const handlePageSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing page size
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleStatusUpdate = useCallback(
    async (orderId: number, newStatus: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/orders/${orderId}/status?status=${newStatus}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session?.user.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update order status");
        }

        refreshOrders();
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    },
    [session, refreshOrders]
  );

  const handlePaymentApproval = useCallback(
    async (orderId: number, isApproved: boolean) => {
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

        refreshOrders();
      } catch (error) {
        console.error("Error handling payment proof:", error);
      }
    },
    [session, refreshOrders]
  );

  if (sessionStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (
    sessionStatus === "unauthenticated" ||
    (sessionStatus === "authenticated" && session?.user?.role !== "ADMIN")
  ) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Admin Order Management</h1>
      <OrderFilter onFilterChange={handleFilterChange} />
      {loading ? (
        <OrderTableSkeleton rowCount={size} />
      ) : (
        <>
          {ordersData && ordersData.data && ordersData.data.content ? (
            <>
              <OrderTable
                orders={ordersData.data.content}
                onOrderSelect={handleOrderSelect}
              />
              <AdminOrderPagination
                currentPage={page + 1}
                setCurrentPage={handlePageChange}
                pageSize={size}
                setPageSize={handlePageSizeChange}
                totalItems={ordersData.data.totalElements}
              />
            </>
          ) : (
            <div>No orders found</div>
          )}
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
