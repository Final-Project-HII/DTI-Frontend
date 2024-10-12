import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Warehouse } from '@/types/warehouse';
import { getAllWarehouse, updateAdmin } from '@/utils/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronsUpDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { z } from 'zod';


interface User {
  id: number;
  name: string;
  warehouseId: null | number;
  imageUrl: string | null;
  email: string;
  isVerified: boolean;
  role: string;
  isActive: boolean;
}


const adminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email(),
  warehouseId: z.number({
    required_error: "Please select a warehouse",
  }).min(1, "Please select a warehouse"),
  role: z.literal("ADMIN"),
});

export type AdminFormData = z.infer<typeof adminSchema>;


interface UpdateAdminFormProps {
  onClose: () => void;
  onAdminUpdated: () => void;
  data: User | null
}


const UpdateAdminForm: React.FC<UpdateAdminFormProps> = ({ onClose, onAdminUpdated, data }) => {
  const [warehouse, setWarehouse] = useState<Warehouse[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const { data: session } = useSession()
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: data?.name,
      email: data?.email,
      warehouseId: data?.warehouseId || undefined,
      role: "ADMIN",
    },
  });

  const selectedWarehouseId = watch('warehouseId');

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await getAllWarehouse("", "", "", "", session!.user.accessToken);
        setWarehouse(response.content);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWarehouse();
  }, []);

  const onSubmit = async (data: AdminFormData) => {
    try {
      await updateAdmin(data, session!.user.accessToken);
      Swal.fire({
        title: 'Admin Has Been Updated!',
        text: 'This will close in 3 seconds.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      onClose();
      onAdminUpdated()

    } catch (error) {
      Swal.fire({
        title: 'Email Has Already Been Registered!',
        text: 'This will close in 3 seconds.',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-center">Update Admin</h2>
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

            <Label htmlFor="email">Email</Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} id="email" disabled={true} />}
            />
            {errors.email?.message && <div className="text-red-500">{errors.email.message}</div>}
            <Label htmlFor="city">Warehouse</Label>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={true}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="justify-between">
                  {warehouse.find(warehouses => warehouses.id === selectedWarehouseId)?.name || "Select a warehouse"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" style={{ width: '300px' }}>
                <Command>
                  <CommandInput placeholder="Search warehouse..." />
                  <CommandList className="max-h-[200px] overflow-y-auto">
                    <CommandEmpty>No warehouse found.</CommandEmpty>
                    <CommandGroup>
                      {warehouse.map((warehouses) => (
                        <CommandItem
                          key={warehouses.id}
                          onSelect={() => {
                            setValue('warehouseId', warehouses.id);
                            setIsPopoverOpen(false);
                          }}
                        >
                          {warehouses.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.warehouseId && <div className="text-red-500">{errors.warehouseId.message}</div>}
          </div>
          <Button type="submit" className="w-full bg-blue-600 text-white">
            Save
          </Button>
        </form>
      </div>
    </div>
  )
}

export default UpdateAdminForm