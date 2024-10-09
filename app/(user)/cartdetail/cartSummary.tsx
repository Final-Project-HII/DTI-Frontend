import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CartSummaryProps {
  cartDetails: {
    totalPrice: number;
  };
}

const CartSummary: React.FC<CartSummaryProps> = ({ cartDetails }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between font-bold text-lg">
        <p>Total Price:</p>
        <p>Rp {cartDetails.totalPrice.toLocaleString()}</p>
      </div>
      <Link href="/checkout" className="w-full">
        <Button className="w-full bg-blue-500 hover:bg-blue-600">
          Checkout
        </Button>
      </Link>
    </div>
  );
};

export default CartSummary;