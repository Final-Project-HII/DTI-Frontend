import { useQueries, UseQueryResult } from "@tanstack/react-query";

// Interface for product data response
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

// Async function to fetch product data
async function getProductData(id: number): Promise<ProductDataResponse> {
  const response = await fetch(`http://localhost:8080/api/product/${id}`);
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
