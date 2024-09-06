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
    </div>
);

export default CategorySelect;