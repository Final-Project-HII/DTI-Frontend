"use client";
import React from "react";
import { useCart } from "../../../hooks/useCart";
import { useSession } from "next-auth/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CartSkeleton from "./cartSkeleton";
import CartItemList from "./cartItemList";
import SuggestedProducts from "./suggestedProduct";
import CartSummary from "./cartSummary";

const CartPage: React.FC = () => {
  const { data: session, status } = useSession();
  const { cartItems, cartDetails, isLoading, error } = useCart();

  if (status === "loading" || isLoading) {
    return <CartSkeleton />;
  }

  if (error) {
    return <div className="mt-28 container mx-auto p-4">Error: {error}</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="mt-28 container mx-auto p-4">
        Please log in to view your cart.
      </div>
    );
  }

  // Get unique product IDs from cart items
  const cartProductIds = cartItems.map(item => item.productId);

  // Generate an array of product IDs from 44 to 53, excluding those already in the cart
  const availableProductIds = Array.from({ length: 10 }, (_, i) => i + 44)
    .filter(id => !cartProductIds.includes(id));

  // Randomly select up to 4 product IDs from the available range
  const suggestedProductIds = availableProductIds
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <div className="mt-28 container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-grow lg:w-2/3">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <CartItemList initialCartItems={cartItems || []} />
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>You might also like</CardTitle>
            </CardHeader>
            <CardContent>
              <SuggestedProducts productIds={suggestedProductIds} currentProductId={-1} />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <CartSummary cartDetails={cartDetails} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;