import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Order } from "@/types/order";
import OrderDetailDialog from "./OrderDetailDialog";
import { ProductDataResponse } from "@/hooks/useProduct";

interface OrderCardProps {
  order: Order;
  productDetails: ProductDataResponse | undefined;
  onOrderUpdate: (updatedOrder: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order: initialOrder,
  productDetails,
  onOrderUpdate,
}) => {
  const [order, setOrder] = useState(initialOrder);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrder(updatedOrder);
    onOrderUpdate(updatedOrder);
  };

  const firstItem =
    order.items && order.items.length > 0 ? order.items[0] : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_payment":
        return { bg: "rgba(255, 165, 0, 0.1)", text: "orange" };
      case "delivered":
        return { bg: "rgba(0, 255, 0, 0.1)", text: "green" };
      case "cancelled":
        return { bg: "rgba(255, 0, 0, 0.1)", text: "red" };
      case "shipped":
        return { bg: "rgba(0, 0, 255, 0.1)", text: "blue" };
      default:
        return { bg: "rgba(128, 128, 128, 0.1)", text: "gray" };
    }
  };

  const statusColor = getStatusColor(order.status);

  const canBeCancelled = !["shipped", "delivered", "cancelled"].includes(
    order.status
  );

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">
            {order.invoiceId}
          </CardTitle>
          <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="px-2 py-1 rounded-full text-sm"
            style={{
              backgroundColor: statusColor.bg,
              color: statusColor.text,
            }}
          >
            {order.status.replace("_", " ").charAt(0).toUpperCase() +
              order.status.replace("_", " ").slice(1) || "Unknown"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src={
              productDetails?.productImages?.[0]?.imageUrl ||
              "/placeholder-image.jpg"
            }
            alt={firstItem?.productName || "Product"}
            className="w-16 h-16 object-cover"
          />
          <div>
            <p className="font-semibold">{firstItem?.productName || "N/A"}</p>
            <p className="text-sm text-gray-500">
              {firstItem
                ? `${firstItem.quantity} item(s) x Rp ${
                    firstItem.price?.toLocaleString() || "N/A"
                  }`
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Order</p>
          <p className="font-bold">
            Rp {order.finalAmount?.toLocaleString() || "N/A"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <OrderDetailDialog
          order={order}
          onOrderUpdate={handleOrderUpdate}
          canBeCancelled={canBeCancelled}
        />
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
