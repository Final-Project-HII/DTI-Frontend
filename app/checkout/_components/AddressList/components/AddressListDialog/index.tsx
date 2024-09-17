import { Address } from '@/types/product';
import React from 'react'
import { useState, useEffect } from 'react';
import { useInView } from "react-intersection-observer";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { getAllAddress } from '@/utils/api';
import { PlusIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import AddAddressForm from '../../../AddNewAddressForm';
import AddressCard from '../AddressCard';

interface AddressListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataChange: () => void;
}

const AddressListDialog: React.FC<AddressListDialogProps> = ({
  open,
  onOpenChange,
  onDataChange
}) => {
  const { data: session } = useSession();
  const [openNewAddressForm, setOpenNewAddressForm] = useState<boolean>(false);
  const [searchByAddressLine, setSearchByAddressLine] = useState<string>("");
  const [size, setSize] = useState<number>(10);
  const { ref, inView } = useInView({ threshold: 0 });
  const [totalElements, setTotalElements] = useState<number>(0);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const fetchAddresses = async () => {
    try {
      const response = await getAllAddress(session!.user.accessToken, searchByAddressLine, '0', size.toString());
      setAddresses(response.content)
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAddresses();
      onDataChange()
    }
  }, [open, searchByAddressLine, size]);

  useEffect(() => {
    if (inView) {
      setSize(prevSize => prevSize + 10);
    }
  }, [inView]);

  const handleAddAddressFormClose = () => {
    setOpenNewAddressForm(false);
    onOpenChange(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent onInteractOutside={(e) => {
          e.preventDefault();
        }} className='max-w-xs lg:max-w-4xl min-h-[600px]'>
          <DialogHeader className='gap-4 flex flex-col'>
            <DialogTitle>Address List</DialogTitle>
            <div className='gap-4 flex flex-col'>
              <div className="flex items-center gap-4 flex-col lg:flex-row">
                <div className="relative w-full">
                  <Input placeholder='Search by address' className='pl-10' value={searchByAddressLine}
                    onChange={(e) => setSearchByAddressLine(e.target.value)} />
                  <FaMapMarkerAlt className='absolute left-3 bottom-1/2 translate-y-1/2 text-orange-500' />
                  <FaSearch className='absolute right-3 bottom-1/2 translate-y-1/2 text-gray-500' />
                </div>
                <Button onClick={() => {
                  setOpenNewAddressForm(true);
                  onOpenChange(false);
                }} className='bg-white border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 flex gap-2'>
                  <PlusIcon className='size-5' /> Add New Address
                </Button>
              </div>
              {addresses.length > 0 && (
                <div className="custom-scrollbar grid grid-cols-1 gap-4 max-h-[500px] overflow-y-scroll lg:grid-cols-3 text-left">
                  {addresses.map((data, index) => (
                    <div key={index} ref={index === addresses.length - 1 &&
                      addresses.length <
                      totalElements
                      ? ref
                      : null}>
                      <AddressCard
                        key={index}
                        data={data}
                        onClose={() => onOpenChange(true)}
                        onConfirm={fetchAddresses}
                        onDataChange={onDataChange}
                      />
                    </div>
                  ))}
                </div>
              )}
              {addresses.length === 0 && (
                <h1 className='text-center justify-center h-full flex items-center'>Address data is empty</h1>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openNewAddressForm} onOpenChange={() => {
        setOpenNewAddressForm(false);
        onOpenChange(true);
      }}>
        <DialogContent className="max-w-sm lg:max-w-4xl" onInteractOutside={(e) => {
          e.preventDefault();
        }}>
          <AddAddressForm onClose={handleAddAddressFormClose} onConfirm={fetchAddresses} onDataChange={onDataChange} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddressListDialog;