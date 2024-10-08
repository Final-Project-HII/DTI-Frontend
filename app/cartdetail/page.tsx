"use client";
import React from "react";
import { useCart } from "../../hooks/useCart";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const CartPage: React.FC = () => {
  const { data: session, status } = useSession();
  const {
    cartItems,
    cartDetails,
    isLoading,
    error,
    updateQuantity,
    removeItem,
  } = useCart();

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
    return <CartSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (
    status === "unauthenticated" ||
    session?.user?.role === "admin" ||
    session?.user?.role === "superadmin"
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      <div className="mt-28 container mx-auto p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Keranjang</h1>
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Image
              src="/loading.png"
              alt="Empty Cart"
              width={200}
              height={200}
              className="mb-8"
            />
            <p className="text-xl mb-6">Your cart is empty.</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg">
                Return to Home
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4">
            <Card className="flex-grow">
              <CardHeader>
                <CardTitle>
                  Toko Indomaret ({cartDetails.totalItems} produk)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b pb-4"
                  >
                    <Image
                      src={
                        item.productDetails.productImages[0]?.imageUrl ||
                        "/placeholder-image.jpg"
                      }
                      alt={item.productName}
                      width={64}
                      height={64}
                      className="object-cover rounded-md mb-2 sm:mb-0"
                    />
                    <div className="flex-grow ml-0 sm:ml-4 mb-2 sm:mb-0">
                      <h3 className="font-bold">{item.productName}</h3>
                      <p className="text-blue-600">
                        Rp {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-end w-full sm:w-72">
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
            <Card className="w-full lg:w-96">
              <CardContent className="flex flex-col gap-4 mt-10">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p>Total Harga Pesanan:</p>
                    <p>Rp {cartDetails.totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <p>Total Pembayaran:</p>
                    <p>Rp {cartDetails.totalPrice.toLocaleString()}</p>
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
    </div>
  );
};

const CartSkeleton: React.FC = () => (
  <div className="mt-28 container mx-auto p-4">
    <Skeleton className="h-8 w-48 mb-4" />
    <div className="flex gap-4">
      <Card className="flex-grow">
        <CardHeader>
          <Skeleton className="h-6 w-64" />
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex justify-between items-center mb-4 border-b pb-4"
            >
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="flex-grow ml-4">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center justify-end w-72">
                <Skeleton className="h-8 w-24 mr-4" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
          <Skeleton className="h-10 w-48" />
        </CardContent>
      </Card>
      <Card className="w-96">
        <CardContent className="flex flex-col gap-4 mt-10">
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default CartPage;
