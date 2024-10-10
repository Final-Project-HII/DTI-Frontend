"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useOrders } from "@/hooks/useOrder";
import { useProductDetails } from "@/hooks/useProduct";
import OrderHeader from "./OrderHeader";
import OrderFilters from "./OrderFilters";
import OrderPagination from "./OrderPagination";
import { Order } from "@/types/order";
import OrderCard from "./OrderCards";
import { Skeleton } from "@/components/ui/skeleton";

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
    const [totalItems, setTotalItems] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { ordersData, loading, error } = useOrders(
        currentPage - 1,
        pageSize,
        statusFilter === "all" ? "" : statusFilter,
        selectedDate
    );

    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    useEffect(() => {
        console.log("Received ordersData:", ordersData); // For debugging
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

    if (!session) return <div>Please log in to view your orders.</div>;
    if (error) return <div>Error loading orders: {error.message}</div>;

    return (
        <div className="space-y-4 mt-28 mx-28">
            <OrderHeader />
            <OrderFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                setDate={setSelectedDate}
            />
            <div className="space-y-4">
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <OrderSkeleton key={index} />
                    ))
                ) : filteredOrders.length === 0 ? (
                    <div>No orders found.</div>
                ) : (
                    filteredOrders.map((order: Order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            productDetails={productDetailsMap.get(order.items[0]?.productId)}
                            onOrderUpdate={handleOrderUpdate}
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