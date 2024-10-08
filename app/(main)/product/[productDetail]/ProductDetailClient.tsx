"use client";
import { useQuery } from "@tanstack/react-query";
import ProductDetail from "./_components/ProductDetailCard";
import {
  ParsedSlug,
  ProductDataResponse,
  parseSlug,
} from '@/types/product';

async function getProductData(slug: string): Promise<ProductDataResponse> {
  const { id } = parseSlug(slug);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/product/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
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
