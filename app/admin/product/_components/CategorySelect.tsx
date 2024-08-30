import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface CategorySelectProps {
    value: string;
    onChange: (value: string) => void;
    openModalFn: () => void;
    categories: { id: number; name: string }[];
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, openModalFn, categories }) => (
    <div className="relative bg-white">
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
                {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()} className='bg-white'>
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        <Button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openModalFn();
            }}
            className="absolute right-0 top-0 h-full px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
            <Plus className="h-5 w-5" />
        </Button>
    </div>
);

export default CategorySelect;