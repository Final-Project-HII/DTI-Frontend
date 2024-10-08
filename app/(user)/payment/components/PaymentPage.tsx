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
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import { useOrders } from "@/hooks/useOrder";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CLOUDINARY_UPLOAD_PRESET = "finproHII";
const CLOUDINARY_CLOUD_NAME = "djyevwtie";

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("");
  const [selectedBank, setSelectedBank] = useState<BankType>("");

  const [proofImageUrl, setProofImageUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const {
    ordersData,
    loading: orderLoading,
    error: orderError,
  } = useOrders(0, 1);

  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  useEffect(() => {
    console.log("ordersData:", ordersData);
    if (
      ordersData &&
      ordersData.data &&
      ordersData.data.content &&
      ordersData.data.content.length > 0
    ) {
      console.log("Setting latest order:", ordersData.data.content[0]);
      setLatestOrder(ordersData.data.content[0]);
    } else {
      console.log("No orders found in ordersData");
    }
  }, [ordersData]);

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

    setIsLoading(true);
    try {
      let response;
      if (paymentMethod === "PAYMENT_GATEWAY") {
        if (!selectedBank) {
          toast({
            title: "Error",
            description: "Please select a bank for payment gateway.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
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
        if (!proofImageUrl) {
          toast({
            title: "Error",
            description: "Please upload proof of payment.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
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

  if (orderLoading) return <div>Loading order details...</div>;
  if (orderError) return <div>Error loading order: {orderError.message}</div>;
  if (!latestOrder)
    return <div>No order found. Please create an order first.</div>;

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
        isPaymentDisabled={!paymentMethod}
      />
    </div>
  );
};

export default PaymentPage;
