// components/checkout/OrderSummaryCard.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ProductList from "./ProductList";

import { ProductDataResponse } from "@/hooks/useProduct";
import { CartItem } from "@/types/cartitem";

interface OrderSummaryCardProps {
  cartItems: (CartItem & { productDetails: ProductDataResponse })[];
  onCourierChange: (courierId: number) => void;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ cartItems, onCourierChange }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<number>(1); // Default to JNE

  const handleCourierChange = (courierId: number) => {
    setSelectedCourier(courierId);
    onCourierChange(courierId);
  };

  return (
    <Card className="shadow-xl border-2">
      <CardHeader>
        <CardTitle>Toko Indomaret</CardTitle>
        <p>{cartItems.length} produk</p>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2">Metode Pengiriman</h3>
        <RadioGroup 
          defaultValue="1" 
          onValueChange={(value) => handleCourierChange(parseInt(value))}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="jne" />
            <Label htmlFor="jne">JNE</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="tiki" />
            <Label htmlFor="tiki">TIKI</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="pos" />
            <Label htmlFor="pos">POS</Label>
          </div>
        </RadioGroup>
        <div className="flex justify-between items-center mt-2">
          <span>Regular - Pilih Waktu</span>
          <span className="text-green-500">Gratis</span>
        </div>
        <p className="text-sm text-gray-500">
          Hari ini, 15 Agustus 2024, 10:00-10:59
        </p>

        <h3 className="font-bold mt-4 mb-2">Pesanan</h3>
        <ProductList 
          items={cartItems} 
          isAccordionOpen={isAccordionOpen}
          setIsAccordionOpen={setIsAccordionOpen}
        />
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;