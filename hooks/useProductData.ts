import { useQuery } from "@tanstack/react-query";
import { getProductData } from "../utils/product";
import { Product } from "../types/product";

export function useProductData(slug: string) {
    return useQuery<Product, Error>({
        queryKey: ["product", slug],
        queryFn: () => getProductData(slug),
    });
}