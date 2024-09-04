"use client";
import React from "react";
import { useCart } from "../../hooks/useCart";
import { useSession } from "next-auth/react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NavBar from "@/components/NavBar";
import Link from "next/link";

const CheckoutPage: React.FC = () => {
  const { data: session } = useSession();
  const { cartItems } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <NavBar />
      <div className="mt-24">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Checkout</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card className="mb-4 shadow-lg border-2">
                <CardHeader>
                  <CardTitle>Kirim ke:</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold">Rumah</p>
                  <p>
                    {session?.user?.name || "User"} (
                    {session?.user?.email || "No email"})
                  </p>
                  <p>Istana Negara</p>
                  <a href="#" className="text-blue-500">
                    Lihat Lokasi
                  </a>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-2">
                <CardHeader>
                  <CardTitle>Toko Indomaret</CardTitle>
                  <p>{cartItems.length} produk</p>
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
                  <Accordion type="single" collapsible>
                    <AccordionItem value="items">
                      <AccordionTrigger>Lihat Semua Item</AccordionTrigger>
                      <AccordionContent>
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center mb-2">
                            <img
                              src="/sudah waktunya.jpg"
                              alt={item.productName}
                              className="w-16 h-16 object-cover mr-4"
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
                  <Link href="/payment">
                    <Button className="w-full">Pilih Pembayaran</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
