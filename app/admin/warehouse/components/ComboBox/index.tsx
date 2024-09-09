import React, { useEffect, useMemo, useState } from 'react'
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from '@/components/ui/button'

interface City {
  name: string;
}

interface Data {
  cityId: City;
}
interface ComboBoxProps<TData> {
  column: any;
  data: TData[];
}

const ComboBox: React.FC<ComboBoxProps<Data>> = ({ column, data }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const uniqueCities = useMemo(() => {
    const cities = new Set(data.map(item => item.cityId.name));
    return Array.from(cities).sort();
  }, [data]);

  useEffect(() => {
    column.setFilterValue(value);
  }, [value, column]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value : "Select city..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandEmpty>No city found.</CommandEmpty>
          <CommandGroup>
            {uniqueCities.map((city) => (
              <CommandItem
                key={city}
                value={city}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === city ? "opacity-100" : "opacity-0"
                  )}
                />
                {city}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );

}

export default ComboBox