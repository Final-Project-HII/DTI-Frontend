import React, { useState, useEffect, useRef } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Button } from '@/components/ui/button';

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
    disabled?: boolean;
}

const WarehouseSelect: React.FC<WarehouseSelectProps> = ({ value, onChange, warehouses, placeholder, disabled = false }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const filteredWarehouses = warehouses.filter((warehouse) =>
        warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (id: string) => {
        if (!disabled) {
            onChange(id);
            setIsPopoverOpen(false);
            setSearchQuery('');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsPopoverOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedWarehouse = warehouses.find(warehouse => warehouse.id.toString() === value);

    return (
        <Popover open={isPopoverOpen && !disabled} onOpenChange={(open) => !disabled && setIsPopoverOpen(open)}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={`justify-between w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={disabled}
                >
                    {selectedWarehouse ? `${selectedWarehouse.name} - ${selectedWarehouse.city.name}` : (placeholder || "Select a warehouse")}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            {!disabled && (
                <PopoverContent className="p-0 w-[25vw] border z-40" side="bottom" align="start" ref={popoverRef}>
                    <Command>
                        <CommandInput
                            placeholder="Search warehouses..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            className='w-full'
                            autoFocus
                        />
                        <CommandList>
                            {filteredWarehouses.length === 0 ? (
                                <CommandEmpty>No matching warehouses found.</CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {filteredWarehouses.map((warehouse) => (
                                        <CommandItem
                                            key={warehouse.id}
                                            onSelect={() => handleSelect(warehouse.id.toString())}
                                        >
                                            {warehouse.name} - {warehouse.city.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            )}
        </Popover>
    );
};

export default WarehouseSelect;