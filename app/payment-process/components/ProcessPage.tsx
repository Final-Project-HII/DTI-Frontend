"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface PaymentDetails {
  va_numbers?: { bank: string; va_number: string }[];
  method?: string;
  orderId?: string;
  proofImageUrl?: string;
  status?: string;
}

const PaymentProcessPage: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [countdown, setCountdown] = useState(86400); // 24 hours in seconds
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedDetails = localStorage.getItem('paymentDetails');
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
    const checkPaymentStatus = async () => {
      if (paymentDetails?.orderId) {
        try {
          const response = await axios.get(`${API_BASE_URL}/payments/${paymentDetails.orderId}/status`, {
            headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
          });
          setPaymentDetails(prev => prev ? {...prev, status: response.data} : null);
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      }
    };

    const intervalId = setInterval(checkPaymentStatus, 10000); // Check every 10 seconds

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

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Payment Process</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentDetails.method === "PAYMENT_PROOF" ? (
            <div>
              <p>Your manual payment proof has been submitted for Order #{paymentDetails.orderId}.</p>
              <p>We will process your payment shortly.</p>
              {paymentDetails.proofImageUrl && (
                <img src={paymentDetails.proofImageUrl} alt="Payment Proof" className="mt-4 max-w-full" />
              )}
            </div>
          ) : (
            <>
              <p className="mb-4">Please complete your payment for Order #{paymentDetails.orderId}</p>
              <p className="font-bold">Bank: {paymentDetails.va_numbers?.[0]?.bank.toUpperCase()}</p>
              <p className="font-bold">Virtual Account Number: {paymentDetails.va_numbers?.[0]?.va_number}</p>
              <p className="mt-4">Time remaining to pay:</p>
              <p className="text-2xl font-bold text-center my-4">{formatTime(countdown)}</p>
            </>
          )}
          <p className="mt-4">Current Status: {paymentDetails.status || 'PENDING'}</p>
          <Button onClick={handleBackToHome} className="w-full mt-4">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProcessPage;