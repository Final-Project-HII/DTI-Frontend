import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Swal from "sweetalert2";

interface ProductCardProps {
  product: Product;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: number;
  categoryId: number;
  categoryName: string;
  totalStock: number;
  productImages: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      Swal.fire({
        title: "Product added to cart!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      console.log("After Swal.fire"); // Debugging line
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to add product to cart.",
        icon: "error",
      });
    }
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <Card className="flex flex-col h-full bg-white hover:shadow-lg transition-all transform hover:scale-105 duration-200 ease-in-out border-none">
      <Link
        href={`/product/${product.id}_${product.name
          .replace(/\s+/g, "-")
          .toLowerCase()}`}
        passHref
      >
        <CardHeader className="relative p-0 h-48">
          <Image
            src={product.productImages[0]?.imageUrl || "/placeholder.jpg"}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className={`rounded-t-lg ${
              product.totalStock === 0 ? "grayscale" : ""
            }`}
            // style={{ filter: product.totalStock === 0 ? 'grayscale(100%)' : 'none' }}
          />
          <Badge className="absolute top-3 right-3 bg-gray-100 text-blue-600 hover:bg-transparent-none">
            {product.categoryName}
          </Badge>
        </CardHeader>
      </Link>
      <CardContent className="flex-grow flex flex-col p-4">
        <CardTitle className="text-md mb-2 line-clamp-2 h-12">
          {product.name}
        </CardTitle>
        <div className="flex items-center text-xs text-blue-600 mb-2">
          <ShoppingBag className="w-3 h-3 mr-1" />
          <span>Hiimart Store</span>
        </div>
        <p className="font-bold text-orange-500 text-lg mt-auto">
          Rp {product.price.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">Weight: {product.weight}g</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50"
          disabled={product.totalStock === 0}
          onClick={handleAddToCart}
        >
          {product.totalStock > 0 && (
            <Plus className="w-4 h-4 mr-2" strokeWidth={3} />
          )}
          {product.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};
