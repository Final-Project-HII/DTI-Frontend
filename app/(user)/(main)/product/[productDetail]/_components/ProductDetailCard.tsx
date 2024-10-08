import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { ProductDetailSkeleton } from "./ProductDetailSkeleton";
import { ImageWithLoading } from "./ImageWithLoading";
import YouMayLike from "@/app/(user)/(main)/product/[productDetail]/_components/YouMayLike";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/components/ui/use-toast";
import { addToCartApi } from "@/utils/api";
import Swal from "sweetalert2";

interface ProductImage {
  id: number;
  imageUrl: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryName: string;
  totalStock: number;
  weight: number;
  productImages: ProductImage[];
}

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.productImages[0]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, updateQuantity, cartItems } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setQuantity(product.totalStock > 0 ? 1 : 0);
  }, [product]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} ${product.name}(s) added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };
  const decreaseQuantity = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  const increaseQuantity = () => {
    setQuantity(Math.min(product.totalStock, quantity + 1));
  };
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }
  return (
    <div className="w-full pt-32 lg:pt-24 p-5 md:pt-24 lg:p-16 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8">
        <div className="space-y-4">
          <Card className="w-full bg-white overflow-hidden p-2">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <ImageWithLoading
                  src={mainImage.imageUrl}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-4 gap-2">
            {product.productImages.map((image, index) => (
              <Card
                key={image.id}
                className={`bg-white p-1 cursor-pointer hover:shadow-md duration-300 overflow-hidden ${
                  mainImage.id === image.id ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <ImageWithLoading
                      src={image.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md w-full h-full"
                      onClick={() => setMainImage(image)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Card className="w-full bg-white">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className=" border-b pb-2">
                  <h1 className="text-xl md:text-2xl lg:text-2xl font-bold text-gray-800 mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs text-blue-600 mb-2 bg-red-100 rounded-xl p-1 px-5">
                      <ShoppingBag className="w-5 h-5 mr-1" />
                      <span className="text-black">Hiimart Store</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500">
                    Rp {product.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm md:text-base text-gray-700">
                      Qty
                    </span>
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={decreaseQuantity}
                        className="text-blue-600"
                        disabled={quantity <= 1 || product.totalStock === 0}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center text-gray-800 text-sm md:text-base">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={increaseQuantity}
                        className="text-blue-600"
                        disabled={quantity >= product.totalStock}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-xs md:text-sm">
                      from{" "}
                      <strong className="text-blue-800">
                        {" "}
                        {product.totalStock}{" "}
                      </strong>{" "}
                      items in stock
                    </span>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    className="h-12 px-6 text-white text-sm md:text-base lg:text-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                    disabled={product.totalStock === 0}
                  >
                    {product.totalStock === 0 ? "Out of Stock" : "+ Cart"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-100 flex items-center justify-center">
                  <img
                    src="/header.svg"
                    alt="category"
                    className="w-10 h-10 md:w-12 md:h-12"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base lg:text-lg text-gray-800 mb-1">
                    Category
                  </h3>
                  <p className="text-xs md:text-sm lg:text-base text-gray-600">
                    {product.categoryName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full bg-white">
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm md:text-base lg:text-lg text-gray-800 mb-4">
                  Deskripsi Produk
                </h3>
                <p className="text-xs md:text-sm lg:text-base font-medium text-gray-600">
                  weight: {product.weight} gram
                </p>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">
                  {product.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-6">
        <YouMayLike category={product.categoryName} />
        <YouMayLike />
      </div>
    </div>
  );
};
export default ProductDetail;
