import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React from 'react'
import img from '@/public/free_ongkir_icon.webp.png'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
import { cities } from '@/utils/cities'
import { ChevronsUpDown, FilterIcon } from 'lucide-react'


const AddWarehouseForm = () => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [selectedCity, setSelectedCity] = React.useState<string | undefined>(undefined)
  const [value, setValue] = React.useState("")
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-center">Add Warehouse</h2>
      <div className="grid grid-cols-3 mt-3 gap-4">
        <form className='col-span-2 gap-6 flex flex-col'>
          <div className="flex flex-col gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              required
            />
            <Label htmlFor="address">Address</Label>
            <Textarea />
            <Label htmlFor="city">City</Label>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline"
                  role="combobox"
                  className="justify-between">{selectedCity || ""}  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search cities..." />
                  <CommandList>
                    <CommandEmpty>No cities found.</CommandEmpty>
                    <CommandGroup>
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
            <Label htmlFor="name">Postal Code</Label>
            <Input
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 text-white">
            Save
          </Button>
        </form>
        <Image src={img} alt='map' width={20} height={20} className='h-full w-full' />
      </div>

    </div>
  )
}

export default AddWarehouseForm