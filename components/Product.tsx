"use client";
import React, { useState } from "react";
import { Products } from "../types";

interface ProductProps {
  product: Products;
  addToCart: (productId: number, quantity: number) => void;
}

const Product: React.FC<ProductProps> = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="border p-4 m-2">
      <h3 className="font-bold">{product.name}</h3>
      <p>Price: ${product.price.toFixed(2)}</p>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="border px-2 py-1 mr-2"
      />
      <button
        onClick={() => addToCart(product.id, quantity)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
