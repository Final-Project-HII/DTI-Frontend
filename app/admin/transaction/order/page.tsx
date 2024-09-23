"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useOrders } from "@/hooks/useOrder";
import { Order } from "@/types/order";
import AdminOrderFilters from "./component/AdminOrderFilters";

import AdminOrderPagination from "./component/AdminOrderPagination";
import AdminOrderTable from "./component/AdminOrdertable";

const AdminOrderList: React.FC = () => {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const { ordersData, loading, error } = useOrders(
    currentPage - 1,
    pageSize,
    statusFilter === "all" ? undefined : statusFilter,
    dateRange.startDate,
    dateRange.endDate
  );

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    console.log(`Changing status of order ${orderId} to ${newStatus}`);
    // You'll need to create an API call to update the order status
  };

  if (!session) return <div>Please log in to access the admin panel.</div>;
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <div className="space-y-4 p-8 mt-20">
      <h1 className="text-2xl font-bold">Order Management</h1>
      <AdminOrderFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <AdminOrderTable
        orders={ordersData?.content || []}
        handleStatusChange={handleStatusChange}
      />
      <AdminOrderPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalItems={ordersData?.totalElements || 0}
      />
    </div>
  );
};

export default AdminOrderList;
