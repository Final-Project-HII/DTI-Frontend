import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Address } from '@/types/product';
import { ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useInView } from "react-intersection-observer";
import AddressListDialog from './components/AddressListDialog';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import MapDialog from '../MapDialog';
interface AddressListProps {
  activeAddress: Address | null;
  onDataChange: () => void;
}
const AddressList: React.FC<AddressListProps> = ({ activeAddress, onDataChange }) => {
  const [openAddressListDialog, setOpenAddressListDialog] = useState<boolean>(false);
  const [openMapDialog, setOpenMapDialog] = useState<boolean>(false);

  const openAddressDialog = () => {
    setOpenAddressListDialog(true);
  };
  const openMap = () => {
    setOpenMapDialog(true);
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
              <h1 className="font-bold">{activeAddress != null ? activeAddress?.name : "No Address Data"}</h1>
              {activeAddress != undefined && (
                <>
                  <h2 className='text-sm'>
                    {activeAddress?.phoneNumber}
                  </h2>
                  <h2 className='text-sm'>{activeAddress?.addressLine}</h2>
                  <Button className="text-blue-700 font-semibold text-sm bg-transparent hover:bg-transparent p-0" onClick={openMap}>
                    Lihat Lokasi
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <AddressListDialog
        open={openAddressListDialog}
        onOpenChange={setOpenAddressListDialog}
        onDataChange={onDataChange}
      />
      <Dialog open={openMapDialog} onOpenChange={setOpenMapDialog}>
        <DialogContent className="max-w-sm lg:max-w-xl">
          {activeAddress && (
            <MapDialog
              lat={activeAddress.lat}
              lon={activeAddress.lon}
              address={activeAddress.addressLine}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddressList;
