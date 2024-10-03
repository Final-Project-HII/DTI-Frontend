"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PaymentDetails, PaymentStatus } from "@/types/payment";



interface OrderDetails {
  id: string;
  invoiceId: string;
  // Add other order fields as needed
}

const PaymentProcessPage: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [countdown, setCountdown] = useState(86400); // 24 hours in seconds
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedDetails = localStorage.getItem("paymentDetails");
    if (storedDetails) {
      setPaymentDetails(JSON.parse(storedDetails));
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchPaymentAndOrderDetails = async () => {
      if (paymentDetails?.orderId && session?.user?.accessToken) {
        try {
          const [paymentResponse, orderResponse] = await Promise.all([
            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}api/payments/${paymentDetails.orderId}/status`,
              {
                headers: {
                  Authorization: `Bearer ${session.user.accessToken}`,
                },
              }
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}api/orders/${paymentDetails.orderId}`,
              {
                headers: {
                  Authorization: `Bearer ${session.user.accessToken}`,
                },
              }
            ),
          ]);

          setPaymentStatus(paymentResponse.data);
          setOrderDetails(orderResponse.data);
        } catch (error) {
          console.error(
            "Error fetching payment status or order details:",
            error
          );
        }
      }
    };

    fetchPaymentAndOrderDetails();
    const intervalId = setInterval(fetchPaymentAndOrderDetails, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [paymentDetails?.orderId, session?.user?.accessToken]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  if (!paymentDetails) {
    return <div>Loading payment details...</div>;
  }

  const displayInvoiceId = orderDetails?.invoiceId || "N/A";

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Payment Process</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentDetails.paymentMethod === "PAYMENT_PROOF" ? (
            <div>
              <p>
                Your manual payment proof has been submitted for Invoice #
                {displayInvoiceId}.
              </p>
              <br />
              <p>We will process your payment shortly.</p>
            </div>
          ) : (
            <>
              <p className="mb-4">
                Please complete your payment for Invoice #{displayInvoiceId}
              </p>
              <p className="font-bold">
                Bank: {paymentDetails.va_numbers?.[0]?.bank.toUpperCase()}
              </p>
              <p className="font-bold">
                Virtual Account Number:{" "}
                {paymentDetails.va_numbers?.[0]?.va_number}
              </p>
              <p className="mt-4">Time remaining to pay:</p>
              <p className="text-2xl font-bold text-center my-4">
                {formatTime(countdown)}
              </p>
            </>
          )}
          <p className="mt-4">
            Current Status: {paymentStatus?.status || "PENDING"}
          </p>
          <br />
          {paymentStatus && (
            <div className="mt-2">
              <p>Amount: Rp {paymentStatus.amount.toLocaleString()}</p>
              <p>Payment Method: {paymentStatus.paymentMethod}</p>
              <p>
                Created At: {new Date(paymentStatus.createdAt).toLocaleString()}
              </p>
            </div>
          )}
          <Button onClick={handleBackToHome} className="w-full mt-4">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProcessPage;
