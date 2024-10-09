import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import debounce from "lodash/debounce";

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  productDetails: {
    productImages: Array<{ imageUrl: string }>;
  };
}

interface CartItemListProps {
  initialCartItems: CartItem[];
}

const CartItemList: React.FC<CartItemListProps> = ({ initialCartItems }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const { updateQuantity, removeItem } = useCart();

  const debouncedUpdateQuantity = useCallback(
    debounce(async (productId: number, newQuantity: number) => {
      await updateQuantity(productId, newQuantity);
    }, 500),
    [updateQuantity]
  );

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveItem(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      debouncedUpdateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    await removeItem(productId);
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const handleRemoveAllItems = async () => {
    for (const item of cartItems) {
      await removeItem(item.productId);
    }
    setCartItems([]);
  };

  useEffect(() => {
    setCartItems(initialCartItems);
  }, [initialCartItems]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Hii Mart ({cartItems.length} product{cartItems.length !== 1 ? "s" : ""})
      </h2>
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b pb-4"
        >
          <div className="flex items-center mb-2 sm:mb-0">
            <Image
              src={
                item.productDetails.productImages[0]?.imageUrl ||
                "/placeholder-image.jpg"
              }
              alt={item.productName}
              width={64}
              height={64}
              className="object-cover rounded-md"
            />
            <div className="ml-4">
              <h3 className="font-bold">{item.productName}</h3>
              <p className="text-blue-600">Rp {item.price.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
            <div className="flex items-center mr-4">
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                onClick={() =>
                  handleUpdateQuantity(item.productId, item.quantity - 1)
                }
              >
                -
              </Button>
              <span className="mx-2 w-8 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                onClick={() =>
                  handleUpdateQuantity(item.productId, item.quantity + 1)
                }
              >
                +
              </Button>
            </div>
            <p className="w-24 text-right font-bold">
              Rp {(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        className="text-blue-600 border-blue-600 hover:bg-blue-50 mt-4"
        onClick={handleRemoveAllItems}
      >
        Delete All Products
      </Button>
    </div>
  );
};

export default CartItemList;
