"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  fetchCartItems,
  fetchProductDetails,
  addToCartApi,
  updateCartItemQuantityApi,
  removeCartItemApi,
} from "../utils/api";
import { CartDetails, CartItem } from "@/types/cartitem";
import { Product } from "@/types/product";

export const useCart = () => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
    (CartItem & { productDetails: Product })[]
  >([]);
  const [cartDetails, setCartDetails] = useState<CartDetails>({
    totalPrice: 0,
    totalItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCartItems = async () => {
    if (status !== "authenticated" || !session?.user?.accessToken) {
      setCartItems([]);
      setCartDetails({ totalPrice: 0, totalItems: 0 });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const cartData = await fetchCartItems(session.user.accessToken);

      if (Array.isArray(cartData.items)) {
        setCartItems(cartData.items);
        setCartDetails({
          totalPrice: cartData.totalPrice || 0,
          totalItems: cartData.totalItems || cartData.items.length || 0,
        });

        const itemsWithDetails = await Promise.all(
          cartData.items.map(async (item: CartItem) => {
            const productDetails = await fetchProductDetails(item.productId);
            return { ...item, productDetails };
          })
        );
        setCartItemsWithDetails(itemsWithDetails);
      } else {
        console.error("Unexpected cart data format:", cartData);
        setError("Unexpected cart data format. Please try again.");
        setCartItems([]);
        setCartDetails({ totalPrice: 0, totalItems: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setError("Failed to load cart items. Please try again.");
      setCartItems([]);
      setCartDetails({ totalPrice: 0, totalItems: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, [session, status]);

  const addToCart = async (productId: number, quantity: number) => {
    if (status !== "authenticated" || !session?.user?.accessToken) {
      throw new Error("User not authenticated");
    }

    try {
      const newItem = await addToCartApi(
        session.user.accessToken,
        productId,
        quantity
      );
      await loadCartItems(); // Reload the entire cart to get updated totals
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (status !== "authenticated" || !session?.user?.accessToken) {
      throw new Error("User not authenticated");
    }

    try {
      await updateCartItemQuantityApi(
        session.user.accessToken,
        productId,
        newQuantity
      );
      await loadCartItems(); // Reload the entire cart to get updated totals
    } catch (error) {
      console.error("Failed to update item quantity:", error);
      throw error;
    }
  };

  const removeItem = async (productId: number) => {
    if (status !== "authenticated" || !session?.user?.accessToken) {
      throw new Error("User not authenticated");
    }

    try {
      await removeCartItemApi(session.user.accessToken, productId);
      await loadCartItems(); // Reload the entire cart to get updated totals
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      throw error;
    }
  };

  const getCartItemCount = () => cartDetails.totalItems;

  const getTotalPrice = () => cartDetails.totalPrice;

  const getCartId = () => {
    return cartItems.length > 0 ? cartItems[0].id : null;
  };


  return {
    cartItems: cartItemsWithDetails,
    cartDetails,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    getCartItemCount,
    getTotalPrice,
    getCartId,
  };
};
