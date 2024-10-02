import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";

import OrderDetailDialog from "./OrderDetailDialog";
import { ProductDataResponse } from "@/hooks/useProduct";

interface OrderCardProps {
  order: Order;
  productDetails: ProductDataResponse | undefined;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, productDetails }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const firstItem =
    order.items && order.items.length > 0 ? order.items[0] : null;

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
              backgroundColor:
                order.status === "pending_payment"
                  ? "rgba(255, 0, 0, 0.1)"
                  : order.status === "delivered"
                  ? "rgba(0, 255, 0, 0.1)"
                  : "rgba(255, 165, 0, 0.1)",
              color:
                order.status === "pending_payment"
                  ? "orange"
                  : order.status === "delivered"
                  ? "green"
                  : "red",
            }}
          >
            {order.status || "Unknown"}
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
        <OrderDetailDialog order={order} />
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
