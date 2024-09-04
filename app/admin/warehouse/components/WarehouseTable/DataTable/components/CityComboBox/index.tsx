import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FilterIcon } from "lucide-react"
import { cities } from "@/utils/cities"

interface CityFilterProps {
  selectedCity: string | undefined
  setSelectedCity: (city: string | undefined) => void
}

const CityComboBox: React.FC<CityFilterProps> = ({ selectedCity, setSelectedCity }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button className="ml-4 bg-blue-600 flex gap-2 items-center">
          <FilterIcon />{selectedCity || "Filter by City"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search cities..." />
          <CommandList>
            <CommandEmpty>No cities found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setSelectedCity(undefined)
                  setIsPopoverOpen(false)
                }}
              >
                All Cities
              </CommandItem>
              {cities.map((city) => (
                <CommandItem
                  key={city.name}
                  onSelect={() => {
                    setSelectedCity(city.name)
                    setIsPopoverOpen(false)
                  }}
                >
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CityComboBox