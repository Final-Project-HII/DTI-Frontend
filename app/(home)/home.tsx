"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Products } from "../types";
import { useCart } from "../hooks/useCart";
import { fetchProducts } from "../../utils/api";
import { useSession } from "next-auth/react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Home: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Products[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { addToCart } = useCart(session?.user?.email ?? undefined);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = async (productId: number) => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    try {
      await addToCart(productId, 1);
      toast({
        title: "Success",
        description: "Product added to cart successfully!",
      });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (productsLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Promosi Minggu Ini</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="/sudah waktunya.jpg"
                  alt={product.name}
                  className="w-full h-40 object-cover mb-2"
                />
                <p className="font-bold">Rp {product.price.toLocaleString()}</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleAddToCart(product.id)}
                  className="w-full"
                >
                  Add to cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;