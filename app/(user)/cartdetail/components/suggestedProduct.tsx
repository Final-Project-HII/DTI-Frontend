import React from "react";
import { ProductCard } from "../../(main)/product/_components/ProductCard";
import SkeletonCard from "../../(main)/product/_components/SkeletonCard";
import { useProductDetails } from "@/hooks/useProduct";
import { ProductDataResponse } from "@/types/product";

interface SuggestedProductsProps {
  productIds: number[];
  currentProductId: number;
}

const SuggestedProducts: React.FC<SuggestedProductsProps> = ({
  productIds,
  currentProductId,
}) => {
  const queryResults = useProductDetails(productIds);

  const isLoading = queryResults.some((result) => result.isLoading);
  const errors = queryResults
    .filter((result) => result.error)
    .map((result) => result.error);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (errors.length > 0) {
    console.error("Errors fetching suggested products:", errors);
    return null;
  }

  const suggestedProducts = queryResults
    .filter((result) => result.data && result.data.id !== currentProductId)
    .map((result) => result.data as ProductDataResponse)
    .slice(0, 4);

  if (suggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {suggestedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default SuggestedProducts;
