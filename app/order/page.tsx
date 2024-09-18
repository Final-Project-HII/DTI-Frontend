"use client";
import React, { useState } from "react";
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

  const { ordersData, loading, error } = useOrders(currentPage - 1, pageSize);

  const filteredOrders = React.useMemo(() => {
    if (!ordersData || !ordersData.content) return [];

    let filtered = ordersData.content;

    if (globalFilter) {
      filtered = filtered.filter((order) =>
        order.id.toString().includes(globalFilter)
      );
    }

    if (statusFilter !== "Semua") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    return filtered;
  }, [ordersData, globalFilter, statusFilter]);

  React.useEffect(() => {
    if (ordersData) {
      setTotalItems(ordersData.totalElements);
    }
  }, [ordersData]);

  const allProductIds = filteredOrders.flatMap((order) =>
    order.items.map((item) => item.productId)
  );

  const productQueryResults = useProductDetails(allProductIds);

  const productDetailsMap = React.useMemo(() => {
    const map = new Map();
    productQueryResults.forEach((result) => {
      if (result.data) {
        map.set(result.data.id, result.data);
      }
    });
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
