"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import PaymentMethodSelection from "./PaymentMethodSelection";
import OrderSummary from "./OrderSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrders } from "@/hooks/useOrder";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const CLOUDINARY_UPLOAD_PRESET = "your_upload_preset";
const CLOUDINARY_CLOUD_NAME = "your_cloud_name";

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [proofImageUrl, setProofImageUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentResponse, setPaymentResponse] = useState<string | null>(null);
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
  const latestOrder = ordersData?.content[0] || null;

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
        const response = await axios.post(
          `${API_BASE_URL}/payments/create`,
          null,
          {
            params: { orderId: latestOrder.id, bank: selectedBank },
            headers: { Authorization: `Bearer ${session.user.accessToken}` },
          }
        );

        console.log("Full response:", response);
        console.log("Response data:", response.data);

        const paymentDetails = response.data;

        localStorage.setItem("paymentDetails", JSON.stringify(paymentDetails));

        router.push("/payment-process");
      } else if (paymentMethod === "PAYMENT_PROOF") {
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

  const simulatePaymentStatus = async (status: string) => {
    if (!latestOrder) return;

    try {
      await axios.post(`${API_BASE_URL}/payments/simulate-status`, null, {
        params: {
          orderId: latestOrder.id,
          newStatus: status,
        },
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      });
      toast({
        title: "Payment Status Updated",
        description: `Payment status simulated to: ${status}`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error simulating payment status:", error);
      toast({
        title: "Simulation Error",
        description: "Failed to simulate payment status. Please try again.",
        variant: "destructive",
      });
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
      {paymentResponse && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="font-bold">Payment Response:</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(JSON.parse(paymentResponse), null, 2)}
          </pre>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">
          Simulate Payment Status (For Testing)
        </h2>
        <div className="space-x-2">
          <Button
            onClick={() => simulatePaymentStatus("COMPLETED")}
            variant="outline"
          >
            Simulate Completed
          </Button>
          <Button
            onClick={() => simulatePaymentStatus("FAILED")}
            variant="outline"
          >
            Simulate Failed
          </Button>
          <Button
            onClick={() => simulatePaymentStatus("REFUNDED")}
            variant="outline"
          >
            Simulate Refunded
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
