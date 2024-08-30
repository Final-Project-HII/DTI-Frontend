"use client";
import React, { useState } from "react";
import { useCart } from "../hooks/useCart";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";


const CheckoutPage: React.FC = () => {
  const userId = 47;
  const { cartItems } = useCart(userId);
  const [isExpanded, setIsExpanded] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const visibleItems = isExpanded ? cartItems : cartItems.slice(0, 1);
  const hiddenItemsCount = cartItems.length - visibleItems.length;

  return (
    <>
      <Navbar />
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
                <p>Mamat (081122334455)</p>
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
                    <AccordionTrigger>
                      {visibleItems.map((item) => (
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
                      {hiddenItemsCount > 0 && (
                        <p className="text-blue-500">
                          +{hiddenItemsCount} Produk Lainnya
                        </p>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      {cartItems.slice(1).map((item) => (
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
                <Button className="w-full">Pilih Pembayaran</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
