"use client";
import React, { useState, useEffect } from "react";
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
import { CartItem } from "@/types/cartitem";

interface PaymentSummaryCardProps {
  totalPrice: number;
}

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({
  totalPrice,
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<CartItem | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    }
  }, [status]);

  const fetchCart = async () => {
    setIsCartLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8080/api/carts", {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load cart. Please try again.");
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!cart) {
      setError("Cart is not loaded. Please refresh the page.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/orders",
        {
          userId: cart.id,
          cartItems: cart.productId,
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

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please sign in to proceed with payment.</div>;
  }

  return (
    <Card className="shadow-xl border-2">
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
          disabled={isLoading || isCartLoading || !cart}
        >
          {isLoading
            ? "Processing..."
            : isCartLoading
            ? "Loading Cart..."
            : "Pilih Pembayaran"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentSummaryCard;
