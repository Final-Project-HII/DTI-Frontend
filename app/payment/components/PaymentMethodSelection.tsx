import React, { useState } from 'react';
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

export type PaymentMethodType = "" | "PAYMENT_GATEWAY" | "PAYMENT_PROOF";
export type BankType = "" | "bca" | "bri" | "bni";

const CLOUDINARY_UPLOAD_PRESET = "finproHII";
const CLOUDINARY_CLOUD_NAME = "djyevwtie";

interface PaymentMethodSelectionProps {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (method: PaymentMethodType) => void;
  selectedBank: BankType;
  setSelectedBank: (bank: BankType) => void;
  proofImageUrl: string;
  setProofImageUrl: (url: string) => void;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  paymentMethod,
  setPaymentMethod,
  selectedBank,
  setSelectedBank,
  proofImageUrl,
  setProofImageUrl
}) => {
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const { toast } = useToast();

  const handleProofUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );

        setProofImageUrl(response.data.secure_url);
        toast({
          title: "Upload Successful",
          description: "Your payment proof has been uploaded.",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload payment proof. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploadingImage(false);
      }
    }
  };

  return (
    <Card className="mb-8 shadow-lg">
      <CardContent className="pt-6">
        <RadioGroup 
          onValueChange={(value: PaymentMethodType) => setPaymentMethod(value)} 
          value={paymentMethod}
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
              <RadioGroupItem value="PAYMENT_PROOF" id="manual" />
              <Label
                htmlFor="manual"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <FaMoneyBillWave className="text-2xl text-green-600" />
                <span className="font-semibold">Manual Payment</span>
              </Label>
            </div>

            {paymentMethod === "PAYMENT_PROOF" && (
              <div className="ml-6 mt-2 space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Bank Transfer Information:</h3>
                  <p>Bank: Example Bank</p>
                  <p>Account Number: 1234567890</p>
                  <p>Account Name: Your Company Name</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Upload Payment Proof:</h3>
                  <Input
                    type="file"
                    onChange={handleProofUpload}
                    disabled={uploadingImage}
                    className="mt-2"
                  />
                  {uploadingImage && <p>Uploading image...</p>}
                  {proofImageUrl && (
                    <img
                      src={proofImageUrl}
                      alt="Payment Proof"
                      className="mt-2 max-w-xs"
                    />
                  )}
                </div>
              </div>
            )}

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
                <RadioGroup 
                  onValueChange={(value: BankType) => setSelectedBank(value)} 
                  value={selectedBank}
                >
                  <div className="space-y-4">
                    {['bca', 'bri', 'bni'].map((bank) => (
                      <div key={bank} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                        <RadioGroupItem value={bank} id={bank} />
                        <Label htmlFor={bank} className="flex items-center space-x-3 cursor-pointer">
                          <img
                            src={`/${bank}.png`}
                            alt={`${bank.toUpperCase()} logo`}
                            className="w-20 h-10 object-contain"
                          />
                          <span className="font-semibold">{bank.toUpperCase()}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelection;