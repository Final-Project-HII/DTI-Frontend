import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown } from 'lucide-react';
import { getAllCity } from '@/utils/cities';
import { City } from '@/types/cities';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWarehouse, updateWarehouse } from '@/utils/api';
import { Warehouse } from '@/types/warehouse';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const warehouseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  addressLine: z.string().min(1, "Address is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  cityId: z.number({
    required_error: "Please select a city",
  }).min(1, "Please select a city"),
  lat: z.number(),
  lon: z.number(),
});

export type WarehouseFormData = z.infer<typeof warehouseSchema>;

interface LatLng {
  lat: number;
  lng: number;
}

interface AddWarehouseFormProps {
  data: Warehouse | null
  onClose: () => void;
  onWarehouseUpdated: () => void;
}

interface DraggableMarkerProps {
  position: LatLng;
  setPosition: (position: LatLng) => void;
}

interface Suggestion {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  address?: {
    postcode?: string;
    [key: string]: string | undefined;
  };
}

const DraggableMarker: React.FC<DraggableMarkerProps> = ({ position, setPosition }) => {
  const markerRef = useRef<L.Marker | null>(null);
  const map = useMap();

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.on('dragend', () => {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
          map.panTo(newPos);
        }
      });
    }
  }, [map, setPosition]);

  useEffect(() => {
    map.panTo(position);
  }, [map, position]);

  return (
    <Marker
      draggable={true}
      position={position}
      ref={markerRef}
    />
  );
};

const UpdateWarehouseForm: React.FC<AddWarehouseFormProps> = ({ data, onClose, onWarehouseUpdated }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<LatLng>({ lat: data!.lat, lng: data!.lon });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: data?.name,
      addressLine: data?.addressLine,
      postalCode: data?.postalCode,
      cityId: data?.city.id,
      lat: data?.lat,
      lon: data?.lon,
    },
  });

  const postalCode = watch('postalCode');
  const selectedCityId = watch('cityId');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getAllCity();
        setCities(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    setValue('lat', position.lat);
    setValue('lon', position.lng);
  }, [position, setValue]);

  const handlePostalCodeChange = async (value: string) => {
    if (value.length > 2) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&country=id&postalcode=${value}`);
        const data: Suggestion[] = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching postal code suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = useCallback((suggestion: Suggestion) => {
    const selectedPostalCode = suggestion.address?.postcode || postalCode;
    setValue('postalCode', selectedPostalCode);
    setValue('addressLine', suggestion.display_name);
    const newPosition = { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) };
    setPosition(newPosition);
    setSuggestions([]);
  }, [postalCode, setValue]);

  const onSubmit = async (formData: WarehouseFormData) => {
    try {
      await updateWarehouse(data!.id, formData);
      onClose();
      onWarehouseUpdated()
    } catch (error) {
      console.error('Error creating warehouse:', error);
    }
  };
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-center">Warehouse Details</h2>
      <div className="flex mt-3 gap-4 flex-col lg:flex-row">
        <form onSubmit={handleSubmit(onSubmit)} className='gap-6 flex flex-col w-full'>
          <div className="flex flex-col gap-2 lg:gap-4">
            <Label htmlFor="name">Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} id="name" />}
            />
            {errors.name?.message && <div className="text-red-500">{errors.name.message}</div>}

            <Label htmlFor="addressLine">Address</Label>
            <Controller
              name="addressLine"
              control={control}
              render={({ field }) => <Textarea {...field} id="addressLine" />}
            />
            {errors.addressLine?.message && <div className="text-red-500">{errors.addressLine.message}</div>}

            <Label htmlFor="postalCode">Postal Code</Label>
            <Controller
              name="postalCode"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="postalCode"
                  onChange={(e) => {
                    field.onChange(e);
                    handlePostalCodeChange(e.target.value);
                  }}
                  placeholder="Enter postal code"
                />
              )}
            />
            {errors.postalCode?.message && <div className="text-red-500">{errors.postalCode.message}</div>}

            {suggestions.length > 0 && (
              <ul className="bg-white border border-gray-300 mt-1 max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}

            <Label htmlFor="city">City</Label>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="justify-between">
                  {cities.find(city => city.id === selectedCityId)?.name || "Select a city"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search cities..." />
                  <CommandList>
                    <CommandEmpty>No cities found.</CommandEmpty>
                    <CommandGroup>
                      {cities.map((city) => (
                        <CommandItem
                          key={city.id}
                          onSelect={() => {
                            setValue('cityId', city.id);
                            setIsPopoverOpen(false);
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
            {errors.cityId && <div className="text-red-500">{errors.cityId.message}</div>}
          </div>
          <Button type="submit" className="w-full bg-blue-600 text-white">
            Update
          </Button>
        </form>
        <div className="w-full h-64 lg:h-auto">
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default UpdateWarehouseForm;