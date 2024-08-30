import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import product1 from '@/public/payment_easy.webp.png'
import Image from 'next/image';

const ProductCard: React.FC = () => {
  const product = {
    id: 1,
    name: "Rinso 2000",
    description: "This is a short description of the example product.",
    price: 150000,
    weight: 500,
    categoryId: 2,
    categoryName: "Electronics",
    productImages: [
      {
        id: 1,
        productId: 1,
        imageUrl: product1,
        createdAt: "2024-08-29T00:00:00Z",
        updatedAt: "2024-08-29T00:00:00Z",
      },
    ],
    createdAt: "2024-08-29T00:00:00Z",
    updatedAt: "2024-08-29T00:00:00Z",
  };

  return (
    <Card className=' border-none w-full'>
      <CardHeader className='relative p-0 mb-4'>
        <Image
          width={30}
          height={30}
          src={product.productImages[0]?.imageUrl || '/placeholder.jpg'}
          alt={product.name}
          className="object-fit rounded-md w-full h-48"
        />
        <Badge className="absolute top-3 right-3 bg-white text-blue-600 hover:bg-white">
          {product.categoryName}
        </Badge>
      </CardHeader>
      <CardContent>
        <CardTitle className="mb-2 text-lg">{product.name}</CardTitle>
        <p className="font-bold text-orange-500 my-2 text-base">Rp {(product.price / 2).toLocaleString()}</p>
        <p className="text-sm">Weight: {product.weight}g</p>
        <p className="text-sm">Category: {product.categoryName}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full border-2 border-blue-600 text-blue-600"> + Add to Cart</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;