"use client";
import React from "react";
import { useCart } from "../../hooks/useCart";
import { useSession } from "next-auth/react";
import NavBar from "@/components/NavBar";

import { useProductDetails, ProductDataResponse } from "@/hooks/useProduct";
import { CartItem } from "@/types/cartitem";
import DeliveryAddressCard from "./components/DeliveryAddress";
import OrderSummaryCard from "./components/OrderSummary";
import PaymentSummaryCard from "./components/PaymentSummary";

const CheckoutPage: React.FC = () => {
  const { data: session } = useSession();
  const { cartItems } = useCart();

  const productIds = cartItems.map((item) => item.productId);
  const productQueries = useProductDetails(productIds);

  const cartItemsWithDetails = cartItems
    .map((item, index) => ({
      ...item,
      productDetails: productQueries[index].data,
    }))
    .filter(
      (item): item is CartItem & { productDetails: ProductDataResponse } =>
        item.productDetails !== undefined
    );

  const totalPrice = cartItemsWithDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <NavBar />
      <div className="mt-24">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Checkout</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <DeliveryAddressCard session={session} />
              <OrderSummaryCard cartItems={cartItemsWithDetails} />
            </div>
            <div>
              <PaymentSummaryCard totalPrice={totalPrice} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
