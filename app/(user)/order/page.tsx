"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useOrders } from "@/hooks/useOrder";
import { useProductDetails } from "@/hooks/useProduct";
import OrderHeader from "./components/OrderHeader";
import OrderFilters from "./components/OrderFilters";
import OrderPagination from "./components/OrderPagination";
import { Order } from "@/types/order";
import OrderCard from "./components/OrderCards";

const OrderList: React.FC = () => {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [totalItems, setTotalItems] = useState(0);

  console.log("Session data:", session);

  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  const { ordersData, loading, error } = useOrders(
    currentPage - 1,
    pageSize,
    statusFilter,
    dateRange.startDate,
    dateRange.endDate
  );

  console.log("Orders data:", ordersData);
  console.log("Loading state:", loading);
  console.log("Error state:", error);

  const filteredOrders = React.useMemo(() => {
    console.log(
      "Filtering orders. Global filter:",
      globalFilter,
      "Status filter:",
      statusFilter
    );

    if (!ordersData || !ordersData.content) {
      console.log("No orders data available for filtering");
      return [];
    }

    let filtered = ordersData.content;

    if (globalFilter) {
      filtered = filtered.filter((order) =>
        order.id.toString().includes(globalFilter)
      );
    }

    if (statusFilter !== "Semua") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    console.log("Filtered orders:", filtered);
    return filtered;
  }, [ordersData, globalFilter, statusFilter]);

  useEffect(() => {
    if (ordersData) {
      console.log("Setting total items:", ordersData.totalElements);
      setTotalItems(ordersData.totalElements);
    }
  }, [ordersData]);

  const allProductIds = filteredOrders.flatMap((order) =>
    order.items.map((item) => item.productId)
  );

  console.log("All product IDs:", allProductIds);

  const productQueryResults = useProductDetails(allProductIds);

  console.log("Product query results:", productQueryResults);

  const productDetailsMap = React.useMemo(() => {
    const map = new Map();
    productQueryResults.forEach((result) => {
      if (result.data) {
        map.set(result.data.id, result.data);
      }
    });
    console.log("Product details map:", map);
    return map;
  }, [productQueryResults]);

  if (!session) return <div>Please log in to view your orders.</div>;
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <div className="space-y-4 mt-28 mx-28">
      <OrderHeader />
      <OrderFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setDateRange={(startDate, endDate) =>
          setDateRange({ startDate, endDate })
        }
      />
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          filteredOrders.map((order: Order) => (
            <OrderCard
              key={order.id}
              order={order}
              productDetails={productDetailsMap.get(order.items[0]?.productId)}
            />
          ))
        )}
      </div>
      <OrderPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalItems={totalItems}
      />
    </div>
  );
};

export default OrderList;