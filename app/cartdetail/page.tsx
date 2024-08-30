"use client";
import React from "react";
import { useCart } from "../hooks/useCart";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const CartPage: React.FC = () => {
  const userId = 72;
  const { cartItems, updateQuantity, removeItem } = useCart(userId);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Keranjang</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Toko Indomaret ({totalItems} produk)</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-4"
                >
                  <img
                    src="/sudah waktunya.jpg"
                    alt={item.productName}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex-grow ml-4">
                    <h3 className="font-bold">{item.productName}</h3>
                    <p>Rp {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.max(0, item.quantity - 1)
                        )
                      }
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => removeItem(item.productId)}
                    className="ml-4"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <p>Total Harga Pesanan: Rp {totalPrice.toLocaleString()}</p>
                <p>Total Diskon: Rp 0</p>
                <p className="font-bold">
                  Total Pembayaran: Rp {totalPrice.toLocaleString()}
                </p>
              </div>
              <Link href="/checkout">
                <Button>Checkout</Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  );
};

export default CartPage;
