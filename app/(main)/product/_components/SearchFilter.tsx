import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <div className="flex flex-wrap gap-4 mb-6">
            <Input
                placeholder="Search products..."
                defaultValue={searchTerm}
                onChange={onSearchChange}
                className="flex-grow"
            />
            <Select value={categoryName} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                    <SelectItem value={ALL_CATEGORIES} className='hover:bg-gray-200'>All Categories</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name} className='hover:bg-gray-200'>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                    <SelectItem value="related">Related</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="createdAt">Date Added</SelectItem>
                </SelectContent>
            </Select>
            {sortBy !== "related" && (
                <Select value={sortDirection} onValueChange={onSortDirectionChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort Direction" />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                </Select>
            )}
        </div>
    );
};