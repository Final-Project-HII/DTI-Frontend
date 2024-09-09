"use client";
import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import axios from 'axios';

// Define types
interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
}

// Set up base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      if (session?.user?.accessToken) {
        try {
          const response = await axios.get<Order[]>(`${API_BASE_URL}/orders`, {
            headers: { Authorization: `Bearer ${session.user.accessToken}` }
          });
          setOrder(response.data[0]); // Assuming the latest order is the first in the array
        } catch (error) {
          console.error('Error fetching order:', error);
          toast({
            title: "Error",
            description: "Failed to fetch order details. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    fetchOrder();
  }, [session, toast]);

  const handlePayment = async () => {
    if (!order) return;

    setIsLoading(true);
    try {
      let response;
      if (paymentMethod === 'gateway') {
        if (!selectedBank) {
          toast({
            title: "Error",
            description: "Please select a bank for payment gateway.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        response = await axios.post(`${API_BASE_URL}/payments/create`, null, {
          params: { orderId: order.id, bank: selectedBank },
          headers: { Authorization: `Bearer ${session?.user?.accessToken}` }
        });
      } else if (paymentMethod === 'manual') {
        // Handle manual transfer (you might want to create a different endpoint for this)
        response = await axios.post(`${API_BASE_URL}/payments/manual`, { orderId: order.id }, {
          headers: { Authorization: `Bearer ${session?.user?.accessToken}` }
        });
      } else {
        throw new Error("Invalid payment method");
      }

      toast({
        title: "Payment Initiated",
        description: paymentMethod === 'gateway' 
          ? "Please complete the payment using the provided virtual account."
          : "Please complete the manual transfer using the provided details.",
        duration: 5000,
      });
      // Here you might want to redirect to a payment confirmation page
      // or display the payment details
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) {
    return <div className="text-center mt-8">Loading order details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Pilih Metode Pembayaran
      </h1>

      <Card className="mb-8 shadow-lg">
        <CardContent className="pt-6">
          <RadioGroup onValueChange={setPaymentMethod} value={paymentMethod}>
            <div className="space-y-6">
              <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                <RadioGroupItem value="manual" id="manual" />
                <Label
                  htmlFor="manual"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <FaMoneyBillWave className="text-2xl text-green-600" />
                  <span className="font-semibold">Pembayaran Manual</span>
                </Label>
              </div>

              <Separator />

              <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                <RadioGroupItem value="gateway" id="gateway" />
                <Label
                  htmlFor="gateway"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <FaCreditCard className="text-2xl text-blue-600" />
                  <span className="font-semibold">Payment Gateway</span>
                </Label>
              </div>

              {paymentMethod === "gateway" && (
                <div className="ml-6 mt-2">
                  <Select onValueChange={setSelectedBank} value={selectedBank}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bca">BCA</SelectItem>
                      <SelectItem value="bri">BRI</SelectItem>
                      <SelectItem value="bni">BNI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.productName} x {item.quantity}</span>
              <span>Rp{item.price.toLocaleString()}</span>
            </div>
          ))}
          <Separator className="my-4" />
          <div className="flex justify-between items-center font-semibold">
            <span>Total Pembayaran:</span>
            <span className="text-xl text-primary">Rp{order.totalAmount.toLocaleString()}</span>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50">
          <Button
            size="lg"
            className="w-full"
            onClick={handlePayment}
            disabled={!paymentMethod || (paymentMethod === "gateway" && !selectedBank) || isLoading}
          >
            {isLoading ? "Processing..." : "Lanjutkan Pembayaran"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentPage;