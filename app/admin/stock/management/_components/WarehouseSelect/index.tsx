import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface City {
    id: number;
    name: string;
}

interface Warehouse {
    id: number;
    name: string;
    addressLine: string;
    city: City;
}

interface WarehouseSelectProps {
    value: string | undefined;
    onChange: (value: string) => void;
    warehouses: Warehouse[];
    placeholder?: string;
}

const WarehouseSelect: React.FC<WarehouseSelectProps> = ({ value, onChange, warehouses, placeholder }) => (
    <div className="relative bg-white">
        <Select value={value ?? ''} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder || "Select a warehouse"} />
            </SelectTrigger>
            <SelectContent className="bg-white">
                {warehouses && warehouses.length > 0 ? (
                    warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id.toString()} className='bg-white'>
                            {warehouse.name} - {warehouse.city.name}
                        </SelectItem>
                    ))
                ) : (
                    <SelectItem value="no_warehouse" disabled>
                        No warehouses available
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    </div>
);

export default WarehouseSelect;