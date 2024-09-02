import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

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
    const truncateDescription = (description: string, maxLength: number) => {
        if (description.length > maxLength) {
            return description.slice(0, maxLength) + '...';
        }
        return description;
    };

    return (
        <Card className="flex flex-col h-full bg-white hover:scale-105 ease-in-out duration-300">
            <Link href={`/product/${product.id}_${product.name.replace(/\s+/g, '-').toLowerCase()}`} passHref>
                <CardHeader className="relative p-0 mb-4">
                    <Image
                        width={200}
                        height={200}
                        src={product.productImages[0]?.imageUrl || '/placeholder.jpg'}

                        alt={product.name}
                        className="w-full h-[150px] lg:h-[200px] object-fit rounded-md"
                    />
                    <Badge className="absolute top-3 right-3 bg-white text-blue-600">
                        {product.categoryName}
                    </Badge>
                </CardHeader >
            </Link >
            <CardContent className="px-4 pb-4 flex-grow mb-0">
                <CardTitle className="mb-2 text-md">{product.name}</CardTitle>
                <p className="font-bold text-orange-500 my-2 text-base">Rp {product.price.toLocaleString()}</p>
                <p className="text-xs ">Weight: {product.weight}g</p>
                <p className="text-xs">Category: {product.categoryName}</p>
            </CardContent>
            <CardFooter className="px-4 pb-4 mt-auto">
                <Button className="w-full border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white"> + Add to Cart</Button>
            </CardFooter >
        </Card >
    );
};
