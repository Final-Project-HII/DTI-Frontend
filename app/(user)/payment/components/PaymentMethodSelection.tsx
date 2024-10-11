import React, { useState } from "react";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export type PaymentMethodType = "" | "PAYMENT_GATEWAY" | "PAYMENT_PROOF";
export type BankType = "" | "BCA" | "BRI" | "BNI";

const CLOUDINARY_UPLOAD_PRESET = "finproHII";
const CLOUDINARY_CLOUD_NAME = "djyevwtie";

const FILE_SIZE = 1024 * 1024; // 1MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

interface PaymentMethodSelectionProps {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (method: PaymentMethodType) => void;
  selectedBank: BankType;
  setSelectedBank: (bank: BankType) => void;
  proofImageUrl: string;
  setProofImageUrl: (url: string) => void;
}

const validationSchema = Yup.object().shape({
  proofImage: Yup.mixed()
    .test("fileSize", "File size is too large (max 1MB)", (value) => {
      if (!value) return true;
      return (value as File).size <= FILE_SIZE;
    })
    .test(
      "fileFormat",
      "Unsupported file format (only jpg, jpeg, png allowed)",
      (value) => {
        if (!value) return true;
        return SUPPORTED_FORMATS.includes((value as File).type);
      }
    )
    .required("Payment proof is required"),
});

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  paymentMethod,
  setPaymentMethod,
  selectedBank,
  setSelectedBank,
  proofImageUrl,
  setProofImageUrl,
}) => {
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const { toast } = useToast();

  const handleProofUpload = async (file: File) => {
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
                <div className="bg-gray-100 p-4 rounded-lg font-bold">
                  <h3 className="font-semibold mb-2">
                    Bank Transfer Information:
                  </h3>
                  <p>Bank: Bank Central Asia</p>
                  <p>Account Number: 1234567890</p>
                  <p>Account Name: HII-Mart</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Upload Payment Proof:</h3>
                  <Formik
                    initialValues={{ proofImage: null }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      if (values.proofImage) {
                        handleProofUpload(values.proofImage);
                      }
                      setSubmitting(false);
                    }}
                  >
                    {({ setFieldValue, isSubmitting }) => (
                      <Form>
                        <Field name="proofImage">
                          {({ field }: any) => (
                            <Input
                              type="file"
                              onChange={(event) => {
                                const file = event.currentTarget.files?.[0];
                                setFieldValue("proofImage", file);
                              }}
                              disabled={isSubmitting || uploadingImage}
                              className="mt-2"
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="proofImage"
                          component="div"
                          className="text-red-500"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting || uploadingImage}
                          className="mt-2 bg-gray-800 text-white px-4 py-2 rounded"
                        >
                          Upload
                        </button>
                      </Form>
                    )}
                  </Formik>
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
                    {["BCA", "BRI", "BNI"].map((bank) => (
                      <div
                        key={bank}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border"
                      >
                        <RadioGroupItem value={bank} id={bank.toLowerCase()} />
                        <Label
                          htmlFor={bank.toLowerCase()}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <img
                            src={`/${bank}.png`}
                            alt={`${bank} logo`}
                            className="w-20 h-10 object-contain"
                          />
                          <span className="font-semibold">{bank}</span>
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
