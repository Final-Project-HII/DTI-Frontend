import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Address } from '@/types/product';
import { getAllAddress } from '@/utils/api';
import { ChevronRight, PlusIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { act, useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import AddAddressForm from '../AddNewAddressForm';
import AddressCard from './components/AddressCard';
import { useInView } from "react-intersection-observer";

const AddressList = () => {
  const { data: session } = useSession();
  const [openAddressListDialog, setOpenAddressListDialog] = useState<boolean>(false);
  const [openNewAddressForm, setOpenNewAddressForm] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [searchByAddressLine, setSearchByAddressLine] = useState<string>("");
  const [size, setSize] = useState<number>(10);
  const { ref, inView } = useInView({ threshold: 0 });
  const [totalElements, setTotalElements] = useState<number>(0)
  const [activeAddresses, setActiveAddresses] = useState<Address | undefined>(undefined);

  useEffect(() => {
    const activeAddresses = addresses.find((address) => address.isActive);
    setActiveAddresses(activeAddresses);
  }, [addresses]);

  const fetchAddresses = async () => {
    try {
      const response = await getAllAddress(session!.user.accessToken, searchByAddressLine, '0', size.toString());
      setAddresses(response.content);
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [searchByAddressLine, size]);

  useEffect(() => {
    if (inView) {
      setSize(prevSize => prevSize + 10);
    }
  }, [inView]);


  const openAddressDialog = () => {
    setOpenAddressListDialog(true);
  };

  const handleAddAddressFormClose = () => {
    setOpenNewAddressForm(false);
    setOpenAddressListDialog(true);
  };

  const handleOpenAddressListModal = () => {
    setOpenAddressListDialog(true);
  };

  return (
    <>
      <Card className="mb-2 shadow-lg border-2 border-blue-200 bg-blue-100">
        <CardHeader className='px-6 py-2 flex flex-row justify-between items-center'>
          <CardTitle className="text-blue-800 text-sm">Send To:</CardTitle>
          <Button onClick={openAddressDialog} className='flex gap-1 items-center text-blue-800 text-sm w-fit p-0 m-0 bg-transparent hover:bg-transparent'>
            Change Address <ChevronRight className='text-blue-800 size-4' />
          </Button>
        </CardHeader>
        <CardContent className="px-6">
          <Card className="shadow-sm bg-white">
            <CardContent className="p-3">
              <h1 className="font-bold">{activeAddresses != undefined ? activeAddresses?.name : "No Address Data"}</h1>
              {activeAddresses != undefined && (
                <>
                  <h2 className='text-sm'>
                    {activeAddresses?.phoneNumber}
                  </h2>
                  <h2 className='text-sm'>{activeAddresses?.addressLine}</h2>
                  <Button className="text-blue-700 font-semibold text-sm bg-transparent hover:bg-transparent p-0">
                    Lihat Lokasi
                  </Button>
                </>
              )}

            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Dialog open={openAddressListDialog} onOpenChange={setOpenAddressListDialog}>
        < DialogContent onInteractOutside={(e) => {
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
                  setOpenAddressListDialog(false);
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
                        onClose={handleOpenAddressListModal}
                        onConfirm={fetchAddresses}
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
        setOpenAddressListDialog(true);
      }}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-sm lg:max-w-4xl" onInteractOutside={(e) => {
          e.preventDefault();
        }}>
          <AddAddressForm onClose={handleAddAddressFormClose} onConfirm={fetchAddresses} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddressList;
