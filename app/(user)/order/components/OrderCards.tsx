import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";

import OrderDetailDialog from './OrderDetailDialog';
import { ProductDataResponse } from '@/hooks/useProduct';

interface OrderCardProps {
  order: Order;
  productDetails: ProductDataResponse | undefined;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, productDetails }) => {
  const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold">Order #{order.id}</span>
          <span className="text-sm text-gray-500">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="px-2 py-1 rounded-full text-sm"
            style={{
              backgroundColor:
                order.status === "PENDING_PAYMENT" ? "rgba(255, 165, 0, 0.1)" :
                order.status === "PAYMENT_SUCCESS" ? "rgba(0, 255, 0, 0.1)" :
                "rgba(255, 0, 0, 0.1)",
              color: 
                order.status === "PENDING_PAYMENT" ? "orange" :
                order.status === "PAYMENT_SUCCESS" ? "green" :
                "red",
            }}
          >
            {order.status || 'Unknown'}
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
            <p className="font-semibold">{firstItem?.productName || 'N/A'}</p>
            <p className="text-sm text-gray-500">
              {firstItem ? `${firstItem.quantity} item(s) x Rp ${firstItem.price?.toLocaleString() || 'N/A'}` : 'N/A'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Order</p>
          <p className="font-bold">Rp {order.finalAmount?.toLocaleString() || 'N/A'}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <OrderDetailDialog order={order} />
        <div className="space-x-2">
          <Button variant="outline">Review</Button>
          <Button>Buy Again</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;