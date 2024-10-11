import React, { useEffect, useState } from "react";
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
import { MessageCircle, HelpCircle, Package } from "lucide-react";
import { PaymentDetails } from "@/types/payment";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useProductDetails } from "@/hooks/useProduct";
import { useSession } from "next-auth/react";

interface OrderDetailDialogProps {
  order: Order;
  onOrderUpdate: (updatedOrder: Order) => void;
  canBeCancelled: boolean;
  onNavigateToPayment: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  order,
  onOrderUpdate,
  canBeCancelled,
  onNavigateToPayment,
}) => {
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const productIds = order.items.map((item) => item.productId);
  const productQueryResults = useProductDetails(productIds);

  const productDetailsMap = React.useMemo(() => {
    const map = new Map();
    productQueryResults.forEach((result) => {
      if (result.data) {
        map.set(result.data.id, result.data);
      }
    });
    return map;
  }, [productQueryResults]);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}api/payments/${order.id}/status`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );
        setPayment(response.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    if (session?.user?.accessToken) {
      fetchPaymentDetails();
    }
  }, [order.id, session?.user?.accessToken]);

  const handleCancelOrder = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}api/orders/${order.id}/cancel`,
        null,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      onOrderUpdate(response.data.data);
      toast({
        title: "Order Canceled",
        description: "The order has been successfully canceled.",
      });
    } catch (error) {
      console.error("Error canceling order:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}api/orders/${order.id}/deliver`,
        null,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      onOrderUpdate(response.data.data);
      toast({
        title: "Order Delivered",
        description: "The order has been marked as delivered.",
      });
    } catch (error) {
      console.error("Error marking order as delivered:", error);
      toast({
        title: "Error",
        description: "Failed to mark the order as delivered. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-white border-b">
          <DialogTitle className="text-xl font-bold">
            Detail Transaksi
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-700 mb-1">
                {order.status}
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">No. Invoice</p>
                  <p className="font-medium">{order.invoiceId}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Tanggal Pembelian: {formatDate(order.orderDate)}
              </p>
              {order.status === "pending_payment" &&
                payment &&
                payment.paymentMethod === "PAYMENT_GATEWAY" &&
                payment.va_numbers &&
                payment.va_numbers.length > 0 && (
                  <div className="mt-2 p-2 bg-blue-100 rounded">
                    <p className="text-sm font-semibold text-blue-800">
                      Selesaikan pembayaran Anda ke nomor Virtual Account:
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      {payment.va_numbers[0].va_number} (
                      {payment.va_numbers[0].bank.toUpperCase()})
                    </p>
                  </div>
                )}
              {order.status === "pending_payment" && !payment && (
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <p className="text-yellow-800 mb-2">
                    Your order is awaiting payment. Please complete the payment
                    process.
                  </p>
                  <Button onClick={onNavigateToPayment} variant="outline">
                    Go to Payment Page
                  </Button>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Detail Produk</h3>
              <div className="bg-white border rounded-lg p-4">
                {order.items && order.items.length > 0 ? (
                  <>
                    <div className="flex items-center">
                      <img
                        src={
                          productDetailsMap.get(order.items[0].productId)
                            ?.productImages?.[0]?.imageUrl ||
                          "/api/placeholder/50/50"
                        }
                        alt={order.items[0].productName}
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                      <div className="flex-grow">
                        <h4 className="font-medium">
                          {order.items[0].productName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {order.items[0].quantity} x{" "}
                          {formatCurrency(order.items[0].price)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(
                          Number(order.items[0].price) * order.items[0].quantity
                        )}
                      </p>
                    </div>
                    {order.items.length > 1 && (
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full mt-4"
                      >
                        <AccordionItem value="additional-items">
                          <AccordionTrigger className="text-yellow-600">
                            View {order.items.length - 1} more item(s)
                          </AccordionTrigger>
                          <AccordionContent>
                            {order.items.slice(1).map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center mt-4"
                              >
                                <img
                                  src={
                                    productDetailsMap.get(item.productId)
                                      ?.productImages?.[0]?.imageUrl ||
                                    "/api/placeholder/50/50"
                                  }
                                  alt={item.productName}
                                  className="w-12 h-12 object-cover rounded mr-4"
                                />
                                <div className="flex-grow">
                                  <h4 className="font-medium">
                                    {item.productName}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {item.quantity} x{" "}
                                    {formatCurrency(item.price)}
                                  </p>
                                </div>
                                <p className="font-semibold">
                                  {formatCurrency(
                                    Number(item.price) * item.quantity
                                  )}
                                </p>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </>
                ) : (
                  <p>No items in this order.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Info Pengiriman</h3>
              <div className="bg-white border rounded-lg p-4">
                <p>
                  <span className="font-medium">Kurir:</span>{" "}
                  {order.courierName}
                </p>
                <p>
                  <span className="font-medium">Asal:</span> {order.originCity}
                </p>
                <p>
                  <span className="font-medium">Tujuan:</span>{" "}
                  {order.destinationCity}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Rincian Pembayaran</h3>
              <div className="bg-white border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <p>Total Harga Pesanan</p>
                  <p>{formatCurrency(order.originalAmount)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p>Biaya Pengiriman</p>
                  <p>{formatCurrency(order.shippingCost)}</p>
                </div>
                <div className="flex justify-between font-semibold">
                  <p>Total Pembayaran</p>
                  <p>{formatCurrency(order.finalAmount)}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4">
              {canBeCancelled && (
                <Button
                  onClick={handleCancelOrder}
                  disabled={isLoading}
                  variant="destructive"
                >
                  Cancel Order
                </Button>
              )}
              {order.status === "shipped" && (
                <Button
                  onClick={handleMarkAsDelivered}
                  disabled={isLoading}
                  variant="default"
                >
                  Mark as Delivered
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
