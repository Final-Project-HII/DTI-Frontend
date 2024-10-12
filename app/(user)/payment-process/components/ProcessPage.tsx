"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PaymentDetails, PaymentStatus } from "@/types/payment";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderDetails {
  id: string;
  invoiceId: string;
}

const PaymentProcessPage: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedDetails = localStorage.getItem("paymentDetails");
    if (storedDetails) {
      setPaymentDetails(JSON.parse(storedDetails));
    } else {
      setLoading(false);
      toast({
        title: "No Active Payment",
        description: "There is no active payment process at the moment.",
      });
    }
  }, [toast]);

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

          // Calculate countdown only for payment gateway method
          if (
            paymentDetails.method === "PAYMENT_GATEWAY" &&
            paymentResponse.data.expirationTime
          ) {
            const expirationTime = new Date(
              paymentResponse.data.expirationTime
            ).getTime();
            const now = new Date().getTime();
            const timeLeft = Math.max(
              0,
              Math.floor((expirationTime - now) / 1000)
            );
            setCountdown(timeLeft);
          } else {
            setCountdown(null);
          }

          setLoading(false);
        } catch (error) {
          console.error(
            "Error fetching payment status or order details:",
            error
          );
          setLoading(false);
        }
      }
    };

    fetchPaymentAndOrderDetails();
    const intervalId = setInterval(fetchPaymentAndOrderDetails, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [
    paymentDetails?.orderId,
    session?.user?.accessToken,
    paymentDetails?.method,
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === null || prevCountdown <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      toast({
        title: "Payment Expired",
        description:
          "The payment time has expired. Your order has been cancelled.",
      });
      router.push("/");
    }
  }, [countdown, toast, router]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-3/4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Active Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There is no active payment process at the moment.</p>
            <Button onClick={handleBackToHome} className="w-full mt-4">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayInvoiceId = orderDetails?.invoiceId || "N/A";

  console.log("Current payment details:", paymentDetails);
  console.log("Payment method:", paymentDetails.method);

  return (
    <div className="container mx-auto px-4 py-8 mt-20 min-h-screen">
      <Card className="max-w-md mx-auto shadow-lg border-blue-500 border-2">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle>Payment Process</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {paymentDetails.method === "PAYMENT_PROOF" ? (
            <div className="space-y-4">
              <p className="font-semibold">
                Your manual payment proof has been submitted for Invoice #
                {displayInvoiceId}.
              </p>
              <p>
                We will process your payment shortly. Please wait for admin
                approval.
              </p>
              <p className="font-bold">
                Current Status: {paymentStatus?.status || "PENDING"}
              </p>
              <p>Amount: Rp {paymentStatus?.amount.toLocaleString()}</p>
              <p>
                Created At:{" "}
                {new Date(paymentStatus?.createdAt || "").toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-semibold">
                Please complete your payment for Invoice #{displayInvoiceId}
              </p>
              <p className="font-bold">
                Bank: {paymentDetails.va_numbers?.[0]?.bank.toUpperCase()}
              </p>
              <p className="font-bold">
                Virtual Account Number:{" "}
                {paymentDetails.va_numbers?.[0]?.va_number}
              </p>
              {countdown !== null && countdown > 0 && (
                <div className="text-center">
                  <p className="font-semibold">Time remaining to pay:</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {formatTime(countdown)}
                  </p>
                </div>
              )}
              <p className="font-bold">
                Current Status: {paymentStatus?.status || "PENDING"}
              </p>
              <p>Amount: Rp {paymentStatus?.amount.toLocaleString()}</p>
              <p>
                Created At:{" "}
                {new Date(paymentStatus?.createdAt || "").toLocaleString()}
              </p>
              {paymentStatus?.expirationTime && (
                <p>
                  Expires At:{" "}
                  {new Date(paymentStatus.expirationTime).toLocaleString()}
                </p>
              )}
            </div>
          )}
          <Button
            onClick={handleBackToHome}
            className="w-full mt-6 bg-blue-500 hover:bg-yellow-600"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProcessPage;
