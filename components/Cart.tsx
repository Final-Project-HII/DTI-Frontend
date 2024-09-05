import { CartItem } from "@/types/cartitem";
import React from "react";

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (itemId: number, newQuantity: number) => void;
  removeItem: (itemId: number) => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeItem,
}) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="border p-4 m-2">
      <h2 className="font-bold text-xl mb-4">Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item.id} className="mb-2">
          <p>
            {item.productName} - Quantity: {item.quantity} - $
            {(item.price * item.quantity).toFixed(2)}
          </p>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="bg-green-500 text-white px-2 py-1 rounded mr-2"
          >
            +
          </button>
          <button
            onClick={() =>
              updateQuantity(item.id, Math.max(0, item.quantity - 1))
            }
            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
          >
            -
          </button>
          <button
            onClick={() => removeItem(item.id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <p className="font-bold mt-4">Total: ${total.toFixed(2)}</p>
    </div>
  );
};

export default Cart;
