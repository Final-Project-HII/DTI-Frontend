"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useOrders } from "@/hooks/useOrder";
import { useProductDetails } from "@/hooks/useProduct";
import { Order } from "@/types/order";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation';
import OrderHeader from "./OrderHeader";
import OrderFilters from "./OrderFilters";
import OrderCard from "./OrderCards";
import OrderPagination from "./OrderPagination";

const OrderSkeleton: React.FC = () => (
  <div className="space-y-2">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-4 w-1/4" />
  </div>
);

const OrderList: React.FC = () => {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();

  const { ordersData, loading, error } = useOrders(
    currentPage - 1,
    pageSize,
    statusFilter === "all" ? "" : statusFilter,
    selectedDate
  );

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    console.log("Received ordersData:", ordersData);
    if (ordersData && ordersData.data && ordersData.data.content) {
      setFilteredOrders(ordersData.data.content);
      setTotalItems(ordersData.data.totalElements);
    } else {
      console.error("Unexpected ordersData structure:", ordersData);
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

  const handleOrderUpdate = (updatedOrder: Order) => {
    setFilteredOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  const handleNavigateToPayment = (orderId: number) => {
    router.push(`/payment?orderId=${orderId}`);
  };

  if (!session) return <div>Please log in to view your orders.</div>;
  if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow space-y-4 mt-36 mb-8 mx-4 sm:mt-28 sm:mx-8 md:mx-16 lg:mx-28">
        <OrderHeader />
        <OrderFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setDate={setSelectedDate}
        />
        <div className="space-y-4 min-h-[60vh] flex flex-col justify-center">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <OrderSkeleton key={index} />
            ))
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/LogoV3.png"
                alt="Logo"
                width={200}
                height={200}
                className="filter grayscale opacity-50"
              />
              <p className="text-gray-500 mt-4 text-xl">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order: Order) => (
              <OrderCard
                key={order.id}
                order={order}
                productDetails={productDetailsMap.get(
                  order.items[0]?.productId
                )}
                onOrderUpdate={handleOrderUpdate}
                onNavigateToPayment={() => handleNavigateToPayment(order.id)}
              />
            ))
          )}
        </div>
        {filteredOrders.length > 0 && (
          <OrderPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalItems={totalItems}
          />
        )}
      </div>
    </div>
  );
};

export default OrderList;