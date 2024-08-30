"use client";
import { useState, useEffect } from "react";
import { CartItem } from "../types";
import {
  fetchCartItems,
  addToCartApi,
  updateCartItemQuantityApi,
  removeCartItemApi,
} from "../../utils/api";

export const useCart = (userIdentifier: number | string | undefined) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCartItems = async () => {
      if (!userIdentifier || typeof userIdentifier !== "number") {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const items = await fetchCartItems(userIdentifier);
        setCartItems(items);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, [userIdentifier]);

  const addToCart = async (productId: number, quantity: number) => {
    if (!userIdentifier || typeof userIdentifier !== "number") {
      throw new Error("User not authenticated");
    }

    try {
      const newItem = await addToCartApi(userIdentifier, productId, quantity);
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
    if (!userIdentifier || typeof userIdentifier !== "number") {
      throw new Error("User not authenticated");
    }

    try {
      await updateCartItemQuantityApi(userIdentifier, productId, newQuantity);
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
    if (!userIdentifier || typeof userIdentifier !== "number") {
      throw new Error("User not authenticated");
    }

    try {
      await removeCartItemApi(userIdentifier, productId);
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

  return {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    getCartItemCount,
  };
};
