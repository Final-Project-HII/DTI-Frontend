import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useOrders } from "@/hooks/useOrder";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { Order } from "@/types/order";
import { ProductDataResponse, useProductDetails } from "@/hooks/useProduct";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OrderCardsProps {
  currentPage: number;
  pageSize: number;
  globalFilter: string;
  statusFilter: string;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
}

const OrderCards: React.FC<OrderCardsProps> = ({
  currentPage,
  pageSize,
  globalFilter,
  statusFilter,
  setTotalItems,
}) => {
  const { data: session } = useSession();
  const { ordersData, loading, error } = useOrders(currentPage - 1, pageSize);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (ordersData && ordersData.content) {
      let filtered = ordersData.content;

      if (globalFilter) {
        filtered = filtered.filter((order) =>
          order.id.toString().includes(globalFilter)
        );
      }

      if (statusFilter !== "Semua") {
        filtered = filtered.filter((order) => order.status === statusFilter);
      }

      setFilteredOrders(filtered);
      setTotalItems(ordersData.totalElements);
    }
  }, [ordersData, globalFilter, statusFilter, setTotalItems]);

  const allProductIds = filteredOrders.flatMap((order) =>
    order.items.map((item) => item.productId)
  );

  const productQueryResults = useProductDetails(allProductIds);

  const productDetailsMap = React.useMemo(() => {
    const map = new Map<number, ProductDataResponse>();
    productQueryResults.forEach((result) => {
      if (result.data) {
        map.set(result.data.id, result.data);
      }
    });
    return map;
  }, [productQueryResults]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {error.message}</div>;
  if (!session) return <div>Please log in to view your orders.</div>;

  if (filteredOrders.length === 0) return <div>No orders found.</div>;

  return (
    <div className="space-y-4">
      {filteredOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          productDetails={productDetailsMap.get(order.items[0].productId)}
        />
      ))}
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  productDetails: ProductDataResponse | undefined;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, productDetails }) => {
  const {
    transactionStatus,
    loading: paymentStatusLoading,
    error: paymentStatusError,
  } = usePaymentStatus(order.id);
  const firstItem = order.items[0];

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold">
            {firstItem.productName || "Loading..."}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(order.orderDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {paymentStatusLoading ? (
            <span>Loading payment status...</span>
          ) : paymentStatusError ? (
            <span>Error loading payment status</span>
          ) : (
            <div
              className="px-2 py-1 rounded-full text-sm"
              style={{
                backgroundColor:
                  transactionStatus === "settlement"
                    ? "rgba(0, 255, 0, 0.1)"
                    : "rgba(255, 0, 0, 0.1)",
                color: transactionStatus === "settlement" ? "green" : "red",
              }}
            >
              {transactionStatus || "Unknown"}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src={
              productDetails?.productImages[0]?.imageUrl ||
              "/placeholder-image.jpg"
            }
            alt={firstItem.productName || "Product"}
            className="w-16 h-16 object-cover"
          />
          <div>
            <p className="font-semibold">{firstItem.productName}</p>
            <p className="text-sm text-gray-500">
              {firstItem.quantity} item(s) x Rp{" "}
              {firstItem.price.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Order</p>
          <p className="font-bold">Rp {order.totalAmount.toLocaleString()}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="link" className="text-green-600">
          View Order Details
        </Button>
        <div className="space-x-2">
          <Button variant="outline">Review</Button>
          <Button>Buy Again</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderCards;
