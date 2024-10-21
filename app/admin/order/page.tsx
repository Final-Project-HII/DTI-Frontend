"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Order } from "@/types/order";
import OrderFilter from "./component/AdminOrderFilters";
import OrderTable from "./component/AdminOrdertable";
import OrderStatusModal from "./component/AdminOrderStatusModal";
import AdminOrderPagination from "./component/AdminOrderPagination";
import { useRouter } from "next/navigation";
import OrderTableSkeleton from "./component/AdminOrderTableSkeleton";

interface ProfileResponseDTO {
  id: number;
  email: string;
  displayName: string;
  phoneNumber: string;
  warehouseId: number;
  role: string;
}

interface OrderResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    content: Order[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
}

interface InsufficientStockItem {
  productName: string;
  requiredQuantity: number;
  availableQuantity: number;
  warehouseName: string;
}

const fetchOrders = async (
  status: string,
  warehouseId: string,
  date: string,
  token?: string,
  page: number = 0,
  size: number = 10
): Promise<OrderResponse> => {
  const params = new URLSearchParams();
  if (status !== "ALL") params.append("status", status);
  if (warehouseId) params.append("warehouse", warehouseId);
  if (date) params.append("date", date);
  params.append("page", String(page));
  params.append("size", String(size));

  const response = await axios.get<OrderResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}api/orders/admin?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const fetchProfile = async (token?: string): Promise<ProfileResponseDTO> => {
  const response = await axios.get<{ data: ProfileResponseDTO }>(
    `${process.env.NEXT_PUBLIC_API_URL}api/users/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

const AdminOrderManagement: React.FC = () => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [orderStatus, setOrderStatus] = useState<string>("ALL");
  const [date, setDate] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const userRole = session?.user?.role;

  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery<ProfileResponseDTO>({
    queryKey: ["profile", session?.user?.accessToken],
    queryFn: () => fetchProfile(session?.user?.accessToken),
    enabled: !!session?.user?.accessToken,
  });

  const userWarehouseId = profileData?.warehouseId?.toString() || null;

  useEffect(() => {
    if (userRole === "ADMIN" && userWarehouseId) {
      setSelectedWarehouse(userWarehouseId);
    }
  }, [userRole, userWarehouseId]);

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    error: ordersError,
    refetch,
  } = useQuery<OrderResponse>({
    queryKey: [
      "orders",
      selectedWarehouse,
      currentPage,
      pageSize,
      orderStatus,
      date,
      session?.user?.accessToken,
    ],
    queryFn: () =>
      fetchOrders(
        orderStatus,
        selectedWarehouse,
        date,
        session?.user?.accessToken,
        currentPage,
        pageSize
      ),
    enabled: !!session?.user?.accessToken && !!userRole,
  });

  const handleFilterChange = useCallback(
    (newStatus: string, newWarehouseId: string, newDate: string) => {
      setOrderStatus(newStatus);
      setSelectedWarehouse(newWarehouseId);
      setDate(newDate);
      setCurrentPage(0);
    },
    []
  );

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage - 1); 
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  }, []);

  const handleOrderSelect = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const handleStatusUpdate = useCallback(
    async (orderId: number, newStatus: string) => {
      if (!session?.user?.accessToken) {
        console.error("No access token available");
        return;
      }

      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}api/orders/${orderId}/status?status=${newStatus}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Order status updated successfully");
          refetch();
        } else {
          console.error("Failed to update order status");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{
            message: string;
            insufficientItems?: InsufficientStockItem[];
            errorDetails?: string;

          }>;
          if (
            axiosError.response?.status === 400 &&
            axiosError.response.data.message.includes("Insufficient stock")
          ) {
            const insufficientItems =
              axiosError.response.data.insufficientItems || [];
            const itemsList = insufficientItems
              .map(
                (item) =>
                  `${item.productName}: Required ${item.requiredQuantity}, Available ${item.availableQuantity} in ${item.warehouseName}`
              )
              .join("\n");

            Swal.fire({
              icon: "error",
              title: "Insufficient Stock",
              html: `The following items have insufficient stock:<br><pre>${itemsList}</pre>`,
              confirmButtonText: "OK",
            });

          } else if (axiosError.response?.status === 500) {
            console.error("Server error:", axiosError.response.data);
            Swal.fire({
              icon: "error",
              title: "Product Not Found",
              html: "The product does not exist in the warehouse.",
              confirmButtonText: "OK",
            });
          } else {
            console.error("Error updating order status:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "An unexpected error occurred while updating the order status.",
              confirmButtonText: "OK",
            });
          }
        } else {
          console.error("Error updating order status:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unexpected error occurred.",
            confirmButtonText: "OK",
          });
        }
      }
    },
    [session, refetch]
  );

  const handlePaymentApproval = useCallback(
    async (orderId: number, isApproved: boolean) => {
      if (!session?.user?.accessToken) {
        console.error("No access token available");
        return;
      }

      try {
        const endpoint = isApproved ? "approve-proof" : "reject-proof";
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}api/payments/${orderId}/${endpoint}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          console.log(
            `Payment ${isApproved ? "approved" : "rejected"} successfully`
          );
          refetch();
        } else {
          console.error(
            `Failed to ${isApproved ? "approve" : "reject"} payment`
          );
        }
      } catch (error) {
        console.error("Error handling payment approval:", error);
      }
    },
    [session, refetch]
  );

  const handleCancelOrder = useCallback(
    async (orderId: number) => {
      if (!session?.user?.accessToken) {
        console.error("No access token available");
        return;
      }

      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}api/orders/${orderId}/status?status=cancelled`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Order cancelled successfully");
          refetch();
        } else {
          console.error("Failed to cancel order");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
      }
    },
    [session, refetch]
  );

  if (sessionStatus === "loading") {
    return <div>Loading session...</div>;
  }

  if (sessionStatus === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (!userRole) {
    return <div>Error: User role not found. Please try logging in again.</div>;
  }

  if (userRole === "ADMIN" && isProfileLoading) {
    return <div>Loading profile data...</div>;
  }

  if (userRole === "ADMIN" && profileError) {
    console.error("Error fetching profile:", profileError);
    return <div>Error loading profile data. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Admin Order Management</h1>
      <OrderFilter
        onFilterChange={handleFilterChange}
        userRole={userRole}
        userWarehouseId={userWarehouseId}
      />
      {isOrdersLoading ? (
        <OrderTableSkeleton rowCount={pageSize} />
      ) : ordersError ? (
        <div>Error loading orders. Please try again later.</div>
      ) : (
        <>
          {ordersData && ordersData.data && ordersData.data.content ? (
            <>
              <OrderTable
                orders={ordersData.data.content}
                onOrderSelect={handleOrderSelect}
              />
              <AdminOrderPagination
            currentPage={currentPage + 1} 
            setCurrentPage={handlePageChange}
            pageSize={pageSize}
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
          onCancelOrder={handleCancelOrder}
        />
      )}
    </div>
  );
};

export default AdminOrderManagement;