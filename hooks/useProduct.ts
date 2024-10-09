import { useQueries, UseQueryResult } from "@tanstack/react-query";

export interface ProductDataResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: number;
  categoryId: number;
  categoryName: string;
  productImages: {
    id: number;
    productId: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
// const BASE_URL = 'http://localhost:8080/api';
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;

async function getProductData(id: number): Promise<ProductDataResponse> {
  const response = await fetch(`${BASE_URL}api/product/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

export function useProductDetails(productIds: number[]) {
  const queryResults = useQueries({
    queries: productIds.map((id) => ({
      queryKey: ["product", id],
      queryFn: () => getProductData(id),
    })),
  });

  return queryResults;
}
