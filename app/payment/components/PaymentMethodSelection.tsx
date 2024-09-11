import React from 'react';
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentMethodSelectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  selectedBank: string;
  setSelectedBank: (bank: string) => void;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  paymentMethod,
  setPaymentMethod,
  selectedBank,
  setSelectedBank
}) => {
  return (
    <Card className="mb-8 shadow-lg">
      <CardContent className="pt-6">
        <RadioGroup onValueChange={setPaymentMethod} value={paymentMethod}>
          <div className="space-y-6">
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
              <RadioGroupItem value="PAYMENT_PROOF" id="manual" />
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
              <RadioGroupItem value="PAYMENT_GATEWAY" id="gateway" />
              <Label
                htmlFor="gateway"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <FaCreditCard className="text-2xl text-blue-600" />
                <span className="font-semibold">Payment Gateway</span>
              </Label>
            </div>

            {paymentMethod === "PAYMENT_GATEWAY" && (
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
  );
};

export default PaymentMethodSelection;