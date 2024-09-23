"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import PaymentMethodSelection from "./PaymentMethodSelection";
import OrderSummary from "./OrderSummary";
import { Input } from "@/components/ui/input";
import { useOrders } from "@/hooks/useOrder";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CLOUDINARY_UPLOAD_PRESET = "finproHII";
const CLOUDINARY_CLOUD_NAME = "djyevwtie";

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<
    "PAYMENT_GATEWAY" | "PAYMENT_PROOF" | ""
  >("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [proofImageUrl, setProofImageUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { cartItems, isLoading: cartLoading } = useCart();
  const router = useRouter();

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
      ordersData &&
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

  const handleProofUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );

        setProofImageUrl(response.data.secure_url);
        toast({
          title: "Upload Successful",
          description: "Your payment proof has been uploaded.",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload payment proof. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploadingImage(false);
      }
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
      />
      {paymentMethod === "PAYMENT_PROOF" && (
        <div className="mb-4">
          <Input
            type="file"
            onChange={handleProofUpload}
            disabled={uploadingImage}
            className="mt-2"
          />
          {uploadingImage && <p>Uploading image...</p>}
          {proofImageUrl && (
            <img
              src={proofImageUrl}
              alt="Payment Proof"
              className="mt-2 max-w-xs"
            />
          )}
        </div>
      )}
      <OrderSummary
        cartItems={cartItems}
        totalAmount={totalAmount}
        onPayment={handlePayment}
        isLoading={isLoading}
        isPaymentDisabled={!paymentMethod}
      />
    </div>
  );
};

export default PaymentPage;
