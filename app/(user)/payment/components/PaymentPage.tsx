"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import PaymentMethodSelection, {
  BankType,
  PaymentMethodType,
} from "./PaymentMethodSelection";
import OrderSummary from "./OrderSummary";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import { useOrders } from "@/hooks/useOrder";
import PaymentPageSkeleton from "./PaymentPageSkeleton";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("");
  const [selectedBank, setSelectedBank] = useState<BankType>("");
  const [proofImageUrl, setProofImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const {
    ordersData,
    loading: orderLoading,
    error: orderError,
  } = useOrders(0, 1, "PENDING_PAYMENT", null);

  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  const isPendingPayment = (status: string) =>
    status.toLowerCase() === "pending_payment";

  // Add this function to check if the payment button should be disabled
  const isPaymentButtonDisabled = () => {
    if (!paymentMethod) return true;
    if (paymentMethod === "PAYMENT_GATEWAY" && !selectedBank) return true;
    if (paymentMethod === "PAYMENT_PROOF" && !proofImageUrl) return true;
    return false;
  };

  useEffect(() => {
    if (
      ordersData &&
      ordersData.data &&
      ordersData.data.content &&
      ordersData.data.content.length > 0
    ) {
      const order = ordersData.data.content[0];
      setLatestOrder(order);

      if (!isPendingPayment(order.status)) {
        Swal.fire({
          title: "Order Not Ready for Payment",
          text: "This order is not in a state ready for payment.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/orders");
        });
      }
    } else if (!orderLoading && !orderError) {
      router.push("/404");
    }
  }, [ordersData, orderLoading, orderError, router]);

  const handlePayment = async () => {
    if (status !== "authenticated") {
      toast({
        title: "Error",
        description: "You must be logged in to make a payment.",
        variant: "destructive",
      });
      return;
    }

    if (!latestOrder) {
      toast({
        title: "Error",
        description: "No order found. Please create an order first.",
        variant: "destructive",
      });
      return;
    }

    if (!isPendingPayment(latestOrder.status)) {
      Swal.fire({
        title: "Error",
        text: "This order is not in a state ready for payment.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (paymentMethod === "PAYMENT_PROOF" && !proofImageUrl) {
      Swal.fire({
        title: "Error!",
        text: "Please upload your payment proof.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (paymentMethod === "PAYMENT_GATEWAY" && !selectedBank) {
      toast({
        title: "Error",
        description: "Please select a bank for payment gateway.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (paymentMethod === "PAYMENT_GATEWAY") {
        response = await axios.post(
          `${API_BASE_URL}api/payments/create`,
          null,
          {
            params: {
              orderId: latestOrder.id,
              paymentMethod: "PAYMENT_GATEWAY",
              bank: selectedBank,
            },
            headers: { Authorization: `Bearer ${session.user.accessToken}` },
          }
        );
      } else if (paymentMethod === "PAYMENT_PROOF") {
        response = await axios.post(
          `${API_BASE_URL}api/payments/create`,
          null,
          {
            params: {
              orderId: latestOrder.id,
              paymentMethod: "PAYMENT_PROOF",
              proofImageUrl: proofImageUrl,
            },
            headers: { Authorization: `Bearer ${session.user.accessToken}` },
          }
        );
      }

      if (response && response.data) {
        localStorage.setItem(
          "paymentDetails",
          JSON.stringify({
            ...response.data,
            method: paymentMethod,
            orderId: latestOrder.id,
            proofImageUrl:
              paymentMethod === "PAYMENT_PROOF" ? proofImageUrl : undefined,
          })
        );
        router.push("/payment-process");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
      }
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (orderLoading) return <PaymentPageSkeleton />;
  if (orderError) return <div>Error loading order: {orderError.message}</div>;
  if (!latestOrder || !isPendingPayment(latestOrder.status)) return null;

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
      <PaymentMethodSelection
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        selectedBank={selectedBank}
        setSelectedBank={setSelectedBank}
        proofImageUrl={proofImageUrl}
        setProofImageUrl={setProofImageUrl}
      />

      <OrderSummary
        orderItems={latestOrder.items}
        shippingCost={latestOrder.shippingCost}
        totalAmount={latestOrder.finalAmount}
        onPayment={handlePayment}
        isLoading={isLoading}
        isPaymentDisabled={isPaymentButtonDisabled()}
      />
    </div>
  );
};

export default PaymentPage;