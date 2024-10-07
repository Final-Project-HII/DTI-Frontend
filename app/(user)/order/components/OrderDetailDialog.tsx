import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Order } from "@/types/order";

interface OrderDetailDialogProps {
  order: Order;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({ order }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatCurrency = (amount: number | string | undefined) => {
    if (typeof amount === "number") {
      return amount.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      });
    } else if (typeof amount === "string") {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        return numAmount.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        });
      }
    }
    return "N/A";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-green-600">
          View Order Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] overflow-y-auto pr-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Order Status</h3>
              <p>{order.status}</p>
            </div>

            <div>
              <h3 className="font-semibold">Order Info</h3>
              <p>Order ID: {order.id}</p>
              <p>Invoice ID: {order.invoiceId}</p>
              <p>Date: {formatDate(order.createdAt)}</p>
            </div>

            <div>
              <h3 className="font-semibold">Product Details</h3>
              {order.items.slice(0, 1).map((item) => (
                <p key={item.id}>
                  {item.productName}: {item.quantity} x{" "}
                  {formatCurrency(item.price)}
                </p>
              ))}
              {order.items.length > 1 && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="additional-items">
                    <AccordionTrigger>
                      View {order.items.length - 1} more item(s)
                    </AccordionTrigger>
                    <AccordionContent>
                      {order.items.slice(1).map((item) => (
                        <p key={item.id}>
                          {item.productName}: {item.quantity} x{" "}
                          {formatCurrency(item.price)}
                        </p>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>

            <div>
              <h3 className="font-semibold">Delivery Info</h3>
              <p>Warehouse: {order.warehouseName}</p>
              <p>Courier: {order.courierName}</p>
              <p>Origin: {order.originCity}</p>
              <p>Destination: {order.destinationCity}</p>
            </div>

            <div>
              <h3 className="font-semibold">Payment Details</h3>
              <p>Total Order Price: {formatCurrency(order.originalAmount)}</p>
              <p>Final Price: {formatCurrency(order.finalAmount)}</p>
            </div>

            <div>
              <h3 className="font-semibold">Additional Info</h3>
              <p>Total Weight: {order.totalWeight} g</p>
              <p>Total Quantity: {order.totalQuantity} item(s)</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
