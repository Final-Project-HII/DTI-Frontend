// File: components/ProductFilter.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
    ChevronDown,
    Package,
    SortAsc,
    ArrowUpDown
} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
    id: number;
    name: string;
}

interface ProductFilterProps {
    categoryName: string;
    sortBy: string;
    sortDirection: string;
    categories: Category[];
    onCategoryChange: (newCategory: string) => void;
    onSortChange: (newSortBy: string) => void;
    onSortDirectionChange: (newDirection: string) => void;
}

const ALL_CATEGORIES = 'all';

const ProductFilter: React.FC<ProductFilterProps> = ({
    categoryName,
    sortBy,
    sortDirection,
    categories,
    onCategoryChange,
    onSortChange,
    onSortDirectionChange,
}) => {
    const pathname = usePathname();

    const sortOptions = [
        { value: 'related', label: 'Related' },
        { value: 'price', label: 'Price' },
        { value: 'name', label: 'Name' },
        { value: 'createdAt', label: 'Date Added' }
    ];

    const directionOptions = [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' }
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-xs">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Filters</h2>


            <Collapsible defaultOpen={true} className="mb-4">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    <div className="flex items-center">
                        <Package className="mr-2 h-5 w-5" />
                        <span className="font-medium">Categories</span>
                    </div>
                    <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                    <Link
                        href={`/product`}
                        className={cn(
                            "block pl-9 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors duration-200",
                            categoryName === ALL_CATEGORIES && "bg-blue-100 text-blue-700 font-semibold"
                        )}
                        onClick={() => onCategoryChange(ALL_CATEGORIES)}
                    >
                        All Categories
                    </Link>
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/product?category=${category.name}`}
                            className={cn(
                                "block pl-9 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors duration-200",
                                categoryName === category.name && "bg-blue-100 text-blue-700 font-semibold"
                            )}
                            onClick={() => onCategoryChange(category.name)}
                        >
                            {category.name}
                        </Link>
                    ))}
                </CollapsibleContent>
            </Collapsible>

            <Collapsible defaultOpen={true} className="mb-4">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    <div className="flex items-center">
                        <SortAsc className="mr-2 h-5 w-5" />
                        <span className="font-medium">Sort By</span>
                    </div>
                    <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            className={cn(
                                "block w-full text-left pl-9 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors duration-200",
                                sortBy === option.value && "bg-blue-100 text-blue-700 font-semibold"
                            )}
                            onClick={() => onSortChange(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </CollapsibleContent>
            </Collapsible>

            {sortBy !== "related" && (
                <Collapsible defaultOpen={true}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
                        <div className="flex items-center">
                            <ArrowUpDown className="mr-2 h-5 w-5" />
                            <span className="font-medium">Sort Direction</span>
                        </div>
                        <ChevronDown className="h-5 w-5" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                        {directionOptions.map((option) => (
                            <button
                                key={option.value}
                                className={cn(
                                    "block w-full text-left pl-9 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors duration-200",
                                    sortDirection === option.value && "bg-blue-100 text-blue-700 font-semibold"
                                )}
                                onClick={() => onSortDirectionChange(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    );
};

export default ProductFilter;