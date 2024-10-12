import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SortAsc, SortDesc } from 'lucide-react';

interface SearchFiltersProps {
    sortBy: string;
    sortDirection: string;
    onSortChange: (newSortBy: string, newSortDirection: string) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
    sortBy,
    sortDirection,
    onSortChange,
}) => {
    const handleSortChange = (value: string) => {
        const [newSortBy, newDirection] = value.split('-');
        onSortChange(newSortBy, newDirection);
    };

    const handleDirectionToggle = () => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        onSortChange(sortBy, newDirection);
    };

    const getCombinedSortValue = () => {
        if (sortBy === 'related') return 'related-asc';
        return `${sortBy}-${sortDirection}`;
    };

    return (
        <div className="flex items-center justify-end gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-nowrap items-center gap-2">
                <Select value={getCombinedSortValue()} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full sm:w-48 rounded-full">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="related-asc">Related</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z to A</SelectItem>
                        <SelectItem value="createdAt-desc">Newest First</SelectItem>
                        <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDirectionToggle}
                    className="rounded-full"
                    disabled={sortBy === 'related'}
                >
                    {sortDirection === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
                </Button>
            </div>
        </div>
    );
};