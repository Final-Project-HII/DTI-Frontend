import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface SearchFiltersProps {
    searchTerm: string;
    categoryName: string;
    sortBy: string;
    sortDirection: string;
    categories: Category[];
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCategoryChange: (newCategory: string) => void;
    onSortChange: (newSortBy: string) => void;
    onSortDirectionChange: (newDirection: string) => void;
}

const ALL_CATEGORIES = 'all';

export const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    categoryName,
    sortBy,
    sortDirection,
    categories,
    onSearchChange,
    onCategoryChange,
    onSortChange,
    onSortDirectionChange,
}) => {
    return (
        <div className="flex flex-col justify-end sm:flex-row flex-wrap gap-4 mb-6">
            {/* <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={onSearchChange}
                className="w-full sm:w-auto flex-grow"
            /> */}
            {/* <Select value={categoryName} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-full sm:w-[180px] group">
                    <SelectValue placeholder="All Categories" />
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 transition duration-300 group-data-[state=open]:rotate-180" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    <SelectItem value={ALL_CATEGORIES} className="hover:bg-gray-100 transition duration-150">All Categories</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name} className="hover:bg-gray-100 transition duration-150">
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select> */}
            <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-full sm:w-[180px] group relative display-none">
                    <SelectValue placeholder="Sort By" />
                    {/* <ChevronDown className=" ml-2 absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition duration-300 group-data-[state=open]:rotate-180" /> */}
                </SelectTrigger>
                <SelectContent className="bg-white">
                    <SelectItem value="related" className="hover:bg-gray-100 transition duration-150">Related</SelectItem>
                    <SelectItem value="price" className="hover:bg-gray-100 transition duration-150">Price</SelectItem>
                    <SelectItem value="name" className="hover:bg-gray-100 transition duration-150">Name</SelectItem>
                    <SelectItem value="createdAt" className="hover:bg-gray-100 transition duration-150">Date Added</SelectItem>
                </SelectContent>
            </Select>
            {sortBy !== "related" && (
                <Select value={sortDirection} onValueChange={onSortDirectionChange}>
                    <SelectTrigger className="w-full sm:w-[180px] group">
                        <SelectValue placeholder="Sort Direction" />
                        {/* <ChevronDown className="ml-2 h-4 w-4 shrink-0 transition duration-300 group-data-[state=open]:rotate-180" /> */}
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="asc" className="hover:bg-gray-100 transition duration-150">Ascending</SelectItem>
                        <SelectItem value="desc" className="hover:bg-gray-100 transition duration-150">Descending</SelectItem>
                    </SelectContent>
                </Select>
            )}
        </div>
    );
};