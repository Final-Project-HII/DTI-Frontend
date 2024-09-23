import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  orderItems: OrderItem[];
  totalAmount: number;
  onPayment?: () => void;
  isLoading?: boolean;
  isPaymentDisabled?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderItems,
  totalAmount,
  onPayment,
  isLoading = false,
  isPaymentDisabled = false,
}) => {
  return (
    <Card className="mt-4">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {orderItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>
              {item.productName} x {item.quantity}
            </span>
            <span>Rp{item.price.toLocaleString()}</span>
          </div>
        ))}
        <Separator className="my-4" />
        <div className="flex justify-between items-center font-semibold">
          <span>Total:</span>
          <span>Rp{totalAmount.toLocaleString()}</span>
        </div>
      </CardContent>
      {onPayment && (
        <CardFooter>
          <Button
            onClick={onPayment}
            disabled={isLoading || isPaymentDisabled}
            className="w-full"
          >
            {isLoading ? "Processing..." : "Pay Now"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderSummary;
