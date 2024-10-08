'use client';

import React from 'react';
import { Package, SortAsc, ArrowUpDown } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Category {
    id: number;
    name: string;
}

interface ProductFilterProps {
    selectedCategories: string[];
    sortBy: string;
    sortDirection: string;
    categories: Category[];
    onCategoryChange: (newCategories: string[]) => void;
    onSortChange: (newSortBy: string, newSortDirection: string) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
    selectedCategories,
    sortBy,
    sortDirection,
    categories,
    onCategoryChange,
    onSortChange,
}) => {
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

    const handleCategoryChange = (category: string) => {
        const updatedCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        onCategoryChange(updatedCategories);
    };

    const handleSortChange = (newSortBy: string) => {
        onSortChange(newSortBy, sortDirection);
    };

    const handleSortDirectionChange = (newDirection: string) => {
        onSortChange(sortBy, newDirection);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-[200px] h-full sticky top-0 hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Filters</h2>

            <Accordion type="multiple" defaultValue={["categories", "sort"]} className="w-full">
                <AccordionItem value="categories">
                    <AccordionTrigger>
                        <div className="flex items-center">
                            <Package className="mr-2 h-5 w-5" />
                            <span>Categories</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-1">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center space-x-3 py-1 px-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <Checkbox
                                        id={`category-${category.id}`}
                                        checked={selectedCategories.includes(category.name)}
                                        onCheckedChange={() => handleCategoryChange(category.name)}
                                    />
                                    <label
                                        htmlFor={`category-${category.id}`}
                                        className="text-sm text-gray-700 leading-none cursor-pointer select-none"
                                    >
                                        {category.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sort">
                    <AccordionTrigger>
                        <div className="flex items-center">
                            <SortAsc className="mr-2 h-5 w-5" />
                            <span>Sort By</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {sortOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    variant={sortBy === option.value ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => handleSortChange(option.value)}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {sortBy !== "related" && (
                    <AccordionItem value="direction">
                        <AccordionTrigger>
                            <div className="flex items-center">
                                <ArrowUpDown className="mr-2 h-5 w-5" />
                                <span>Sort Direction</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                {directionOptions.map((option) => (
                                    <Button
                                        key={option.value}
                                        variant={sortDirection === option.value ? "secondary" : "ghost"}
                                        className="w-full justify-start"
                                        onClick={() => handleSortDirectionChange(option.value)}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </div>
    );
};

export default ProductFilter;