"use client";
import React from "react";
import { useCart } from "../../hooks/useCart";
import { useSession } from "next-auth/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import { ProductDataResponse, useProductDetails } from "@/hooks/useProduct";

const CartPage: React.FC = () => {
  const { data: session, status } = useSession();
  const {
    cartItems,
    isLoading: isCartLoading,
    updateQuantity,
    removeItem,
  } = useCart();

  const productIds = cartItems.map((item) => item.productId);
  const productQueries = useProductDetails(productIds);

  const isLoading =
    isCartLoading || productQueries.some((query) => query.isLoading);
  const isError = productQueries.some((query) => query.isError);

  const cartItemsWithDetails = cartItems.map((item, index) => ({
    ...item,
    productDetails: productQueries[index].data as ProductDataResponse,
  }));

  const totalPrice = cartItemsWithDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cartItemsWithDetails.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleUpdateQuantity = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity === 0) {
      await removeItem(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveAllItems = async () => {
    for (const item of cartItems) {
      await removeItem(item.productId);
    }
  };

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading product details</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please log in to view your cart.</div>;
  }

  return (
    <>
      <NavBar />
      <div className="mt-28 container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Keranjang</h1>
        {cartItemsWithDetails.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="flex gap-4">
            <Card className="flex-grow">
              <CardHeader>
                <CardTitle>Toko Indomaret ({totalItems} produk)</CardTitle>
              </CardHeader>
              <CardContent>
                {cartItemsWithDetails.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center mb-4 border-b pb-4"
                  >
                    <Image
                      src={
                        item.productDetails?.productImages[0]?.imageUrl ||
                        "/placeholder-image.jpg"
                      }
                      alt={item.productName}
                      width={64}
                      height={64}
                      className="object-cover rounded-md"
                    />
                    <div className="flex-grow ml-4">
                      <h3 className="font-bold">{item.productName}</h3>
                      <p className="text-blue-600">
                        Rp {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-end w-72">
                      <div className="flex items-center mr-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                        >
                          -
                        </Button>
                        <span className="mx-2 w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                      <p className="w-24 text-right font-bold">
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  onClick={handleRemoveAllItems}
                >
                  Hapus Semua Produk
                </Button>
              </CardContent>
            </Card>
            <Card className="w-96">
              <CardContent className="flex flex-col gap-4 mt-10">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p>Total Harga Pesanan:</p>
                    <p>Rp {totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <p>Total Diskon:</p>
                    <p>Rp 0</p>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <p>Total Pembayaran:</p>
                    <p>Rp {totalPrice.toLocaleString()}</p>
                  </div>
                </div>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Checkout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
