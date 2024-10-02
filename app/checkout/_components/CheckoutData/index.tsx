"use client";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/hooks/useCart";
import { ProductDataResponse, useProductDetails } from "@/hooks/useProduct";
import { Address } from "@/types/product";
import { getActiveAddress, getShippingData } from "@/utils/api";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaShippingFast } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import AddressCard from "../AddressList";
import { Skeleton } from "@/components/ui/skeleton";

interface Shipping {
  id: number;
  name: string;
  cost: number;
}

const CheckoutData = () => {
  const { data: session } = useSession();
  const { cartItems } = useCart();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [activeAddresses, setActiveAddresses] = useState<Address | null>(null);
  const router = useRouter();
  const productIds = cartItems.map((item) => item.productId);
  const productQueries = useProductDetails(productIds);
  const [selectedCourier, setSelectedCourier] = useState<Shipping | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingData, setShippingData] = useState<Shipping[]>([]);

  const handleCourierChange = (value: string) => {
    const selected = shippingData.find(
      (courier) => courier.id.toString() === value
    );
    setSelectedCourier(selected || null);
  };

  const cartItemsWithDetails = cartItems.map((item, index) => ({
    ...item,
    productDetails: productQueries[index].data as ProductDataResponse,
  }));

  const totalPrice = cartItemsWithDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const fetchActiveAddress = async () => {
    try {
      const response = await getActiveAddress(session!.user.accessToken);
      if (response == null) {
        setActiveAddresses(null);
      } else {
        setActiveAddresses(response.data);
      }
      await fetchShippingData();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShippingData = async () => {
    try {
      setIsLoading(true);
      const response = await getShippingData(session!.user.accessToken);
      setShippingData(response);
      if (response.length > 0) {
        setSelectedCourier(response[0]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveAddress();
  }, []);

  const handleCreateOrder = async () => {
    if (activeAddresses == null) {
      Swal.fire({
        title: "Please Choose Your Address First Before You Continue!",
        text: "This will close in 3 seconds.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }

    if (cartItems.length === 0) {
      setError("Cart is empty. Please add items to your cart.");
      return;
    }

    if (!selectedCourier) {
      setError("Please select a courier.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/orders`,
        null,
        {
          params: {
            addressId: activeAddresses.id,
            courierId: selectedCourier.id,
          },
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: "Order Created Successfully!",
          text: "Redirecting to payment page...",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(() => {
          router.push("/payment");
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating order:", error);

      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;

        if (responseData.message.includes("pending order")) {
          Swal.fire({
            title: "Pending Order",
            text: responseData.message,
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          setError(responseData.message || "An unexpected error occurred. Please try again.");
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const shippingCost = selectedCourier ? selectedCourier.cost : 0;
  const totalWithShipping = totalPrice + shippingCost;

  return (
    <div className="mt-24">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <AddressCard
              activeAddress={activeAddresses}
              onDataChange={fetchActiveAddress}
            />
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle>Toko Indomaret</CardTitle>
                <p>{cartItemsWithDetails.length} produk</p>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold mb-2">Shipping Method</h3>
                {isLoading ? (
                  <Skeleton className="h-[50px] w-full  bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                ) : (
                  <Select
                    onValueChange={handleCourierChange}
                    defaultValue={selectedCourier?.id.toString()}
                  >
                    <SelectTrigger className="w-full p-8 relative">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {shippingData.map((data) => (
                          <SelectItem
                            key={data.id}
                            value={data.id.toString()}
                            className="w-full relative"
                          >
                            <div className="flex w-full gap-2 items-center">
                              <FaShippingFast
                                size={25}
                                className="text-blue-800"
                              />
                              <h4 className="font-bold">
                                {data.name.toUpperCase()}
                              </h4>
                              <span className="absolute right-14 font-bold">
                                Rp{" "}
                                {(data.cost / 1000)
                                  .toFixed(3)
                                  .replace(".", ",")}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}

                <h3 className="font-bold mt-4 mb-2">Pesanan</h3>
                {cartItemsWithDetails.length > 0 && (
                  <div className="flex items-center mb-2">
                    <Image
                      src={
                        cartItemsWithDetails[0].productDetails?.productImages[0]
                          ?.imageUrl || "/placeholder-image.jpg"
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
                      <AccordionTrigger>Lihat produk lainnya</AccordionTrigger>
                      <AccordionContent>
                        {cartItemsWithDetails.slice(1).map((item) => (
                          <div key={item.id} className="flex items-center mb-2">
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
                  <span>Rp {shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total Pembayaran</span>
                  <span>Rp {totalWithShipping.toLocaleString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={handleCreateOrder}
                  disabled={
                    isLoading || cartItems.length === 0 || !selectedCourier
                  }
                >
                  {isLoading ? "Processing..." : "Pilih Pembayaran"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
    </div>
  );
};

export default CheckoutData;
