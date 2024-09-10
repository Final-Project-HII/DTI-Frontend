'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductDataResponse, useProductDetails } from "@/hooks/useProduct";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import AddressCard from "../AddressCard";

const CheckoutData = () => {
  const { data: session } = useSession();
  const { cartItems } = useCart();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const productIds = cartItems.map((item) => item.productId);
  const productQueries = useProductDetails(productIds);

  const cartItemsWithDetails = cartItems.map((item, index) => ({
    ...item,
    productDetails: productQueries[index].data as ProductDataResponse,
  }));

  const totalPrice = cartItemsWithDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return (
    <div className="mt-24">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <AddressCard />
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle>Toko Indomaret</CardTitle>
                <p>{cartItemsWithDetails.length} produk</p>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold mb-2">Metode Pengiriman</h3>
                <div className="flex justify-between items-center">
                  <span>Regular - Pilih Waktu</span>
                  <span className="text-green-500">Gratis</span>
                </div>
                <p className="text-sm text-gray-500">
                  Hari ini, 15 Agustus 2024, 10:00-10:59
                </p>

                <h3 className="font-bold mt-4 mb-2">Pesanan</h3>
                {cartItemsWithDetails.length > 0 && (
                  <div className="flex items-center mb-2">
                    <Image
                      src={
                        cartItemsWithDetails[0].productDetails
                          ?.productImages[0]?.imageUrl ||
                        "/placeholder-image.jpg"
                      }
                      alt={cartItemsWithDetails[0].productName}
                      width={64}
                      height={64}
                      className="object-cover mr-4"
                    />
                    <div>
                      <p>{cartItemsWithDetails[0].productName}</p>
                      <p className="text-sm text-gray-500">
                        x {cartItemsWithDetails[0].quantity}
                      </p>
                    </div>
                  </div>
                )}
                {cartItemsWithDetails.length > 1 && (
                  <Accordion
                    type="single"
                    collapsible
                    value={isAccordionOpen ? "items" : ""}
                    onValueChange={(value) =>
                      setIsAccordionOpen(value === "items")
                    }
                  >
                    <AccordionItem value="items">
                      <AccordionTrigger>
                        Lihat produk lainnya
                      </AccordionTrigger>
                      <AccordionContent>
                        {cartItemsWithDetails.slice(1).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center mb-2"
                          >
                            <Image
                              src={
                                item.productDetails?.productImages[0]
                                  ?.imageUrl || "/placeholder-image.jpg"
                              }
                              alt={item.productName}
                              width={64}
                              height={64}
                              className="object-cover mr-4"
                            />
                            <div>
                              <p>{item.productName}</p>
                              <p className="text-sm text-gray-500">
                                x {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
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
              </CardContent>
              <CardFooter>
                <Link href="/payment" className="w-full">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Pilih Pembayaran
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutData