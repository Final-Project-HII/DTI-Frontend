"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PaymentDetails {
  va_numbers?: { bank: string; va_number: string }[];
  method?: string;
  orderId?: string;
  proofImageUrl?: string;
}

const PaymentProcessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [countdown, setCountdown] = useState(86400); // 24 hours in seconds

  const orderId = searchParams.get("orderId");
  const bank = searchParams.get("bank");
  const vaNumber = searchParams.get("vaNumber");
  const method = searchParams.get("method");

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
    <div className="container mx-auto px-4 py-8 mt-36">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Payment Process</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentDetails.method === "manual" ? (
            <div>
              <p>
                Your manual payment proof has been submitted for Order #
                {paymentDetails.orderId}.
              </p>
              <p>We will process your payment shortly.</p>
              {paymentDetails.proofImageUrl && (
                <img
                  src={paymentDetails.proofImageUrl}
                  alt="Payment Proof"
                  className="mt-4 max-w-full"
                />
              )}
            </div>
          ) : (
            <>
              <p className="mb-4">
                Please complete your payment for Order #
                {paymentDetails.va_numbers?.[0]?.va_number}
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
          <Button onClick={handleBackToHome} className="w-full mt-4">
            Back to Home
          </Button>
        </CardContent>
        
      </Card>
    </div>
  );
};

export default PaymentProcessPage;
