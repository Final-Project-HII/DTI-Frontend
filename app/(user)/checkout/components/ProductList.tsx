import React from "react";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { ProductDataResponse } from "@/hooks/useProduct";
import { CartItem } from "@/types/cartitem";

interface ProductListProps {
  items: (CartItem & { productDetails: ProductDataResponse })[];
  isAccordionOpen: boolean;
  setIsAccordionOpen: (isOpen: boolean) => void;
}

const ProductList: React.FC<ProductListProps> = ({ items, isAccordionOpen, setIsAccordionOpen }) => {
  return (
    <>
      {items.length > 0 && (
        <div className="flex items-center mb-2">
          <Image
            src={items[0].productDetails?.productImages[0]?.imageUrl || "/placeholder-image.jpg"}
            alt={items[0].productName}
            width={64}
            height={64}
            className="object-cover mr-4"
          />
          <div>
            <p>{items[0].productName}</p>
            <p className="text-sm text-gray-500">x {items[0].quantity}</p>
          </div>
        </div>
      )}
      {items.length > 1 && (
        <Accordion
          type="single"
          collapsible
          value={isAccordionOpen ? "items" : ""}
          onValueChange={(value) => setIsAccordionOpen(value === "items")}
        >
          <AccordionItem value="items">
            <AccordionTrigger>Lihat produk lainnya</AccordionTrigger>
            <AccordionContent>
              {items.slice(1).map((item) => (
                <div key={item.id} className="flex items-center mb-2">
                  <Image
                    src={item.productDetails?.productImages[0]?.imageUrl || "/placeholder-image.jpg"}
                    alt={item.productName}
                    width={64}
                    height={64}
                    className="object-cover mr-4"
                  />
                  <div>
                    <p>{item.productName}</p>
                    <p className="text-sm text-gray-500">x {item.quantity}</p>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
};

export default ProductList;