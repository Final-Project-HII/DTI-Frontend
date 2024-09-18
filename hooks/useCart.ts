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
import { CartItem } from "@/types/cartitem";
import { Product } from "@/types/product";

export const useCart = () => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
    (CartItem & { productDetails: Product })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCartItems = async () => {
      if (status !== "authenticated" || !session?.user?.accessToken) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const items = await fetchCartItems(session.user.accessToken);
        setCartItems(items);

        const itemsWithDetails = await Promise.all(
          items.map(async (item: CartItem) => {
            const productDetails = await fetchProductDetails(item.productId);
            return { ...item, productDetails };
          })
        );
        setCartItemsWithDetails(itemsWithDetails);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
        setError("Failed to load cart items. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

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
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.productId === productId
        );
        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += quantity;
          return updatedItems;
        } else {
          return [...prevItems, newItem];
        }
      });
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
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
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
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      throw error;
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCartId = () => {
    return cartItems.length > 0 ? cartItems[0].id : null;
  };

  return {
    cartItems: cartItemsWithDetails,
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
