// components/checkout/OrderSummaryCard.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductList from "./ProductList";

import { ProductDataResponse } from "@/hooks/useProduct";
import { CartItem } from "@/types/cartitem";

interface OrderSummaryCardProps {
  cartItems: (CartItem & { productDetails: ProductDataResponse })[];
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ cartItems }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  return (
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