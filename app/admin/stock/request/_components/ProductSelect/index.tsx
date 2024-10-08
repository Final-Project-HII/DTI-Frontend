import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Button } from '@/components/ui/button';

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
    value: string | undefined;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;

const fetchProducts = async (): Promise<Product[]> => {
    let allProducts: Product[] = [];
    let currentPage = 0;
    let totalPages = 1;

    while (currentPage < totalPages) {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                page: currentPage,
                size: 100, // Adjust this value based on your API's maximum allowed page size
            },
        });

        allProducts = [...allProducts, ...response.data.content];
        totalPages = response.data.totalPages;
        currentPage++;
    }

    return allProducts;
};

const ProductSelect: React.FC<ProductSelectProps> = ({
    value,
    onChange,
    placeholder = 'Select a product',
}) => {
    const { data: products, isLoading, error } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const filteredProducts = products
        ? products.filter(
            (product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    if (isLoading) return <div>Loading products...</div>;
    if (error) return <div>Error loading products</div>;

    const selectedProductName = products?.find(
        (product) => product.id.toString() === value
    )?.name;

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="justify-between w-full">
                    {selectedProductName || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[25vw] z-40 border">
                <Command>
                    <CommandInput
                        placeholder="Search products..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        className="w-full"
                    />
                    <CommandList>
                        {filteredProducts.length === 0 && (
                            <CommandEmpty>No matching products found.</CommandEmpty>
                        )}
                        <CommandGroup>
                            {filteredProducts.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    onSelect={() => {
                                        onChange(product.id.toString());
                                        setIsPopoverOpen(false);
                                    }}
                                >
                                    {product.name} (Total Stock: {product.totalStock})
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default ProductSelect;