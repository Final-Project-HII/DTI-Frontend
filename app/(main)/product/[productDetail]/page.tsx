"use client";
import { useQuery } from "@tanstack/react-query";
import ProductDetail from "./_components/ProductDetailCard";

// Interface for parsed slug
export interface ParsedSlug {
  id: string;
  name: string;
}

// Function to parse the slug
export function parseSlug(slug: string): ParsedSlug {
  const [id, ...nameParts] = slug.split("_");
  return {
    id,
    name: nameParts.join("_").replace(/-/g, " "),
  };
}

export interface ProductDataResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: number;
  categoryId: number;
  categoryName: string;
  totalStock: number;
  productImages: {
    id: number;

    productId: number;
    imageUrl: string;
    name: string;
    description: string;
    price: number;
    weight: number;
    categoryId: number;
    categoryName: string;
    totalStock: number;
    productImages: {
      id: number;
      productId: number;
      imageUrl: string;
      createdAt: string;
      updatedAt: string;
    }[];

    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Async function to fetch product data
async function getProductData(slug: string): Promise<ProductDataResponse> {
  const { id } = parseSlug(slug);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/product/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

export interface ProductDetailProps {
  product: ProductDataResponse;
}

export default function ProductPage({
  params,
}: {
  params: { productDetail: string };
}) {
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery<ProductDataResponse, Error>({
    queryKey: ["product", params.productDetail],
    queryFn: () => getProductData(params.productDetail),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!product) return <div>No product found</div>;

  return <ProductDetail product={product} />;
}
