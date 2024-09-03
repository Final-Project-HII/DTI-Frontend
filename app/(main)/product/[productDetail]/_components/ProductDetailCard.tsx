import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/app/hooks/useCart";
import { useToast } from "@/components/ui/use-toast";

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
  productImages: ProductImage[];
}

interface ProductDetailProps {
  product: Product;
}

interface ImageWithLoadingProps {
  src: string;
  alt: string;
  layout: "fixed" | "fill" | "responsive" | "intrinsic";
  objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
  className?: string;
  onClick?: () => void;
}
const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.productImages[0]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, updateQuantity, cartItems } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  const cartItem = cartItems.find((item) => item.productId === product.id);
  const isInCart = !!cartItem;

  return (
    <div className="w-full lg:py-32 p-4 pt-24 md:pt-24 lg:p-16 bg-gray-50">
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
                <div className="flex justify-between items-start border-b pb-4">
                  <h1 className="text-xl md:text-2xl lg:text-2xl font-bold text-gray-800">
                    {product.name}
                  </h1>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-orange-500 text-xs md:text-sm"
                    >
                      14%
                    </Badge>
                    <p className="text-sm md:text-base text-gray-500 line-through">
                      {formatPrice(product.price * 1.14)}
                    </p>
                  </div>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500">
                    {formatPrice(product.price)}
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
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="text-blue-600"
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
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="text-blue-600"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    className="h-12 px-6 text-white text-sm md:text-base lg:text-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                  >
                    + Cart
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
                <h3 className="font-semibold text-sm md:text-base lg:text-lg text-gray-800">
                  Deskripsi Produk
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">
                  {product.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ImageWithLoading: React.FC<ImageWithLoadingProps> = ({
  src,
  alt,
  layout,
  objectFit,
  className,
  onClick,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        layout={layout}
        objectFit={objectFit}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onLoadingComplete={() => setIsLoading(false)}
        onClick={onClick}
      />
    </div>
  );
};

const ProductDetailSkeleton = () => {
  return (
    <div className="w-full lg:py-32 p-4 md:p-8 lg:p-16 bg-gray-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8">
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                className="w-full aspect-square rounded-md"
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Card className="w-full bg-white">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b pb-4">
                  <Skeleton className="h-8 w-3/4" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-1/2" />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full bg-white">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
