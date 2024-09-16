import DeleteModal from '@/components/DeleteModal'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog"
import { Address } from '@/types/product'
import { deleteAddresses, toogleActiveAddress } from '@/utils/api'
import { AlertDialog } from '@radix-ui/react-alert-dialog'
import { EditIcon, TrashIcon } from 'lucide-react'
import React, { useState } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import UpdateAddressForm from '../../../UpdateAddressForm'
import { useSession } from 'next-auth/react'

interface AddressCardProps {
  data: Address
  onClose: () => void
  onConfirm: () => void
  onDataChange: () => void
}
const AddressCard: React.FC<AddressCardProps> = ({ data, onClose, onConfirm, onDataChange }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editAddressDialogOpen, setEditAddressDialogOpen] = useState(false)
  const { data: session } = useSession();

  const handleEditAddressFormClose = () => {
    setEditAddressDialogOpen(false)
  }


  const handleActiveAddressToogle = async () => {
    try {
      await toogleActiveAddress(data.id, session!.user.accessToken)
      onConfirm()
      onDataChange()
    } catch (error) {
      console.error("Failed to toogle active address:", error);
    }
    Swal.fire({
      title: 'Your Active Address Has Been Succesfully Changed!',
      text: 'This will close in 3 seconds.',
      icon: 'success',
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  }

  const handleDeleteAddress = async () => {
    try {
      await deleteAddresses(data.id, session!.user.accessToken);
      onConfirm()
      onDataChange()
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
    Swal.fire({
      title: 'Your Address Has Been Deleted Succesfully!',
      text: 'This will close in 3 seconds.',
      icon: 'success',
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    setIsDeleteDialogOpen(false)
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteDialogOpen(false)
  }
  return (
    <>
      <Card className={`bg-white p-4 shadow-lg gap-1 flex flex-col relative ${data.isActive == true && "border-blue-600 border-2"}`} onClick={handleActiveAddressToogle}>
        <div className="flex items-start gap-2">
          <h1 className="font-bold text-sm">{data.name}</h1>
          <FaMapMarkerAlt className="text-orange-500 mt-1" />
        </div>
        <h2 className='text-xs font-semibold lg:text-sm'>{data.phoneNumber}</h2>
        <h2 className='text-xs lg:text-sm'>{data.city.name}</h2>
        <h2 className='text-xs lg:text-sm'>{data.postalCode}</h2>
        <div className='h-10 overflow-hidden'>
          <h2 className='text-xs lg:text-sm line-clamp-2'>{data.addressLine}</h2>
        </div>

        <div className=" flex gap-2 mt-2">
          <div onClick={(e) => {
            e.stopPropagation();
            setEditAddressDialogOpen(true);
          }}>
            <EditIcon className='text-green-600 size-5' />
          </div>
          <div onClick={(e) => {
            e.stopPropagation();
            setIsDeleteDialogOpen(true);
          }}>
            <TrashIcon className='text-red-600 size-5' />
          </div>
        </div>
        {data.isActive == true && <span className="bg-blue-500 text-white px-3 py-1  text-[9px] rounded-tl-lg font-semibold uppercase tracking-wide absolute bottom-0 right-0">
          Active
        </span>}
      </Card>
      <Dialog open={editAddressDialogOpen} onOpenChange={() => {
        setEditAddressDialogOpen(false)
        onClose()
      }}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-sm lg:max-w-4xl" onInteractOutside={(e) => {
          e.preventDefault();
        }}>
          <UpdateAddressForm onClose={handleEditAddressFormClose} onConfirm={onConfirm} data={data} onDataChange={onDataChange} />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteModal onConfirm={handleDeleteAddress} onClose={handleCloseDeleteModal} description="Are you sure you want to delete the address?" />
      </AlertDialog>
    </>
  )
}

export default AddressCard