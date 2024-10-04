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
import { createWarehouse, updateAddress } from '@/utils/api';
import { Address } from '@/types/product';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const addressSchema = z.object({
  recipientName: z.string().min(1, "Recipient's name is required"),
  addressLine: z.string().min(1, "Address is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  cityId: z.number({
    required_error: "Please select a city",
  }).min(1, "Please select a city"),
  lat: z.number(),
  lon: z.number(),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface LatLng {
  lat: number;
  lng: number;
}

interface UpdateAddressFormProps {
  onClose: () => void;
  onConfirm: () => void;
  data: Address
  onDataChange: () => void
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

const UpdateAddressForm: React.FC<UpdateAddressFormProps> = ({ onClose, onConfirm, data, onDataChange }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<LatLng>({ lat: data.lat, lng: data.lon });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const { data: session } = useSession();
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      recipientName: data.name,
      addressLine: data.addressLine,
      postalCode: data.postalCode,
      cityId: data.city.id,
      lat: position.lat,
      lon: position.lng,
      phoneNumber: data.phoneNumber,
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

  const onSubmit = async (formData: AddressFormData) => {
    try {
      await updateAddress(formData, data.id, session!.user.accessToken);
      Swal.fire({
        title: 'Your Address Has Been Updated Succesfully!',
        text: 'This will close in 3 seconds.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      onClose()
      onConfirm();
      onDataChange();
    } catch (error) {
      console.error('Error updating warehouse:', error);
    }
  };
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-center">Update Address</h2>
      <div className="flex mt-3 gap-4 flex-col lg:flex-row">
        <form onSubmit={handleSubmit(onSubmit)} className='gap-6 flex flex-col w-full'>
          <div className="flex flex-col gap-2 lg:gap-4">
            <Label htmlFor="name">Recipients Name</Label>
            <Controller
              name="recipientName"
              control={control}
              render={({ field }) => <Input {...field} id="name" placeholder="Enter recipient's name" />}
            />
            {errors.recipientName?.message && <div className="text-red-500">{errors.recipientName.message}</div>}

            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => <Input {...field} id="phoneNumber" placeholder="Enter phone number" />}
            />
            {errors.phoneNumber?.message && <div className="text-red-500">{errors.phoneNumber.message}</div>}

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


            <Label htmlFor="addressLine">Address</Label>
            <Controller
              name="addressLine"
              control={control}
              render={({ field }) => <Textarea {...field} id="addressLine" placeholder="Enter your address" />}
            />
            {errors.addressLine?.message && <div className="text-red-500">{errors.addressLine.message}</div>}


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
            Save
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

export default UpdateAddressForm;