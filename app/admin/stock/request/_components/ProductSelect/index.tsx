import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
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
    }[];
    stocks: {
        id: number;
        warehouseId: number;
        warehouseName: string;
        quantity: number;
    }[];
}

interface ProductSelectProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const fetchProducts = async (): Promise<Product[]> => {
    let allProducts: Product[] = [];
    let currentPage = 0;
    let totalPages = 1;

    while (currentPage < totalPages) {
        const response = await axios.get('http://localhost:8080/api/product', {
            params: {
                page: currentPage,
                size: 100, // Adjust this value based on your API's maximum allowed page size
            }
        });

        allProducts = [...allProducts, ...response.data.content];
        totalPages = response.data.totalPages;
        currentPage++;
    }

    return allProducts;
};

const ProductSelect: React.FC<ProductSelectProps> = ({ value, onChange, placeholder = "Select a product" }) => {
    const { data: products, isLoading, error } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });

    if (isLoading) return <div>Loading products...</div>;
    if (error) return <div>Error loading products</div>;

    return (
        <div>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {products && products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name} (Total Stock: {product.totalStock})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default ProductSelect;