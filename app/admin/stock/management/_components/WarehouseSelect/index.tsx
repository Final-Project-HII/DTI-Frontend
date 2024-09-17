import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Warehouse {
    id: number;
    name: string;
}

interface WarehouseSelectProps {
    value: string;
    onChange: (value: string) => void;
    warehouses: Warehouse[];
    placeholder?: string;
}

const WarehouseSelect: React.FC<WarehouseSelectProps> = ({ value, onChange, warehouses, placeholder }) => (
    <div className="relative bg-white">
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white">
                {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id.toString()} className='bg-white'>
                        {warehouse.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

export default WarehouseSelect;