"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCart } from "@/hooks/useCart";
import { useActiveAddress } from "@/hooks/useActiveAddress";
import OrderSummaryCard from "./OrderSummary";

const PaymentSummaryCard: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<number>(1); // Default to JNE

  const {
    activeAddress,
    isLoading: isAddressLoading,
    error: addressError,
  } = useActiveAddress();
  const {
    cartItems,
    isLoading: isCartLoading,
    error: cartError,
    getTotalPrice,
  } = useCart();

  const handleCourierChange = (courierId: number) => {
    setSelectedCourier(courierId);
  };

  const handleCreateOrder = async () => {
    if (cartItems.length === 0 || !activeAddress) {
      setError(
        "Cart is empty or active address is not loaded. Please refresh the page."
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/orders",
        {
          userId: session?.user?.id,
          warehouseId: 1,
          addressId: activeAddress.id,
          courierId: selectedCourier,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        router.push(`/payment`);
      } else {
        setError("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError("An error occurred while creating the order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAddressLoading || isCartLoading) {
    return <div>Loading...</div>;
  }

  if (addressError || cartError) {
    return <div>Error: {addressError || cartError}</div>;
  }

  const totalPrice = getTotalPrice();

  return (
    <>
      <OrderSummaryCard
        cartItems={cartItems}
        onCourierChange={handleCourierChange}
      />
      <Card className="shadow-xl border-2 mt-4">
        <CardHeader>
          <CardTitle>Ringkasan Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <span>Total Harga Pesanan</span>
            <span>Rp {totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Ongkos Kirim</span>
            <span className="text-green-500">GRATIS</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total Pembayaran</span>
            <span>Rp {totalPrice.toLocaleString()}</span>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={handleCreateOrder}
            disabled={isLoading || cartItems.length === 0 || !activeAddress}
          >
            {isLoading ? "Processing..." : "Pilih Pembayaran"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default PaymentSummaryCard;
