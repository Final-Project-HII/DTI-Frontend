import DeleteModal from '@/components/DeleteModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { ChevronRight, EditIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import AddAddressForm from '../AddNewAddressForm';
import UpdateAddressForm from '../UpdateAddressForm';

const AddressCard = () => {
  const { data: session } = useSession();
  const [openAddressListDialog, setOpenAddressListDialog] = useState<boolean>(false);
  const [openNewAddressForm, setOpenNewAddressForm] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editAddressDialogOpen, setEditAddressDialogOpen] = useState(false)
  const openAddressDialog = () => {
    setOpenAddressListDialog(true);
  };
  const handleAddAddressFormClose = () => {
    setOpenNewAddressForm(false);
  };

  const handleEditAddressFormClose = () => {
    setEditAddressDialogOpen(false)
  }

  const handleDeleteAddress = async () => {
    Swal.fire({
      title: 'Your Address Has Been Deleted Succesfully!',
      text: 'This will close in 3 seconds.',
      icon: 'success',
      timer: 3000, // 3 seconds
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
      <Card className="mb-2 shadow-lg border-2 border-blue-200 bg-blue-100">
        <CardHeader className='px-6 py-2 flex flex-row justify-between items-center'>
          <CardTitle className="text-blue-800 text-sm">Kirim ke:</CardTitle>
          <Button onClick={openAddressDialog} className='flex gap-1 items-center text-blue-800 text-sm w-fit p-0 m-0 bg-transparent hover:bg-transparent'>Change Address <ChevronRight className='text-blue-800 size-4' /></Button>
        </CardHeader>
        <CardContent className="px-6">
          <Card className="shadow-sm bg-white">
            <CardContent className="p-3">
              <p className="font-bold">Rumah</p>
              <p className='text-sm'>
                {session?.user?.name || "User"} (
                {session?.user?.email || "No email"})
              </p>
              <p className='text-sm'>Istana Negara</p>
              <Button className="text-blue-700 font-semibold text-sm bg-transparent hover:bg-transparant p-0">
                Lihat Lokasi
              </Button>
            </CardContent>
          </Card>
        </CardContent >
      </Card >

      <Dialog open={openAddressListDialog} onOpenChange={setOpenAddressListDialog}>
        <DialogContent onInteractOutside={(e) => {
          e.preventDefault();
        }} className=' max-w-xs lg:max-w-4xl min-h-[600px]'>
          <DialogHeader className='gap-4 flex flex-col'>
            <DialogTitle>Daftar Alamat (2/32)</DialogTitle>
            <DialogDescription className='gap-4 flex flex-col' >
              <div className="flex items-center gap-4 flex-col lg:flex-row">
                <div className="relative w-full">
                  <Input placeholder='Search by city' className='pl-10' />
                  <FaMapMarkerAlt className='absolute left-3 bottom-1/2 translate-y-1/2 text-orange-500' />
                  <FaSearch className='absolute right-3 bottom-1/2 translate-y-1/2 text-gray-500' />
                </div>
                <Button onClick={() => {
                  setOpenNewAddressForm(true)
                  setOpenAddressListDialog(false)
                }} className='bg-white border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 flex gap-2'><PlusIcon className='size-5' /> Tambah Alamat Baru</Button>
              </div>
              <div className="custom-scrollbar grid grid-cols-1 gap-4 max-h-[500px] overflow-y-scroll lg:grid-cols-3 text-left">
                <Card className="bg-white p-4 shadow-lg gap-1 flex flex-col relative border-blue-600 border-2">
                  <div className="flex items-start gap-2">
                    <p className="font-bold text-sm">JL. Kelapa Hibrida Utara Blok GB.3/26</p>
                    <FaMapMarkerAlt className="text-orange-500 mt-1" />
                  </div>
                  <p className='text-xs font-semibold lg:text-sm'>Hendry Tjahaja Surijanto Putra</p>
                  <p className='text-xs lg:text-sm'>081931386119</p>
                  <p className='text-xs lg:text-sm'>Jl. Kelapa Hibrida Utara Blok GB.3/26 Sektor 6 Gading Serpong 15810, BANTEN</p>
                  <div className=" flex gap-2 mt-2">
                    <EditIcon className='text-green-600 size-5' onClick={() => setEditAddressDialogOpen(true)} />
                    <TrashIcon className='text-red-600 size-5' onClick={() => setIsDeleteDialogOpen(true)} />
                  </div>
                  <span className="bg-blue-500 text-white px-3 py-1  text-[9px] rounded-tl-lg font-semibold uppercase tracking-wide absolute bottom-0 right-0">
                    Active
                  </span>
                </Card>
                <Card className="bg-white p-4 shadow-lg gap-1 flex flex-col">
                  <div className="flex items-start gap-2">
                    <p className="font-bold text-sm">JL. Kelapa Hibrida Utara Blok GB.3/26</p>
                    <FaMapMarkerAlt className="text-orange-500 mt-1" />
                  </div>
                  <p className='text-sm font-semibold'>Hendry Tjahaja Surijanto Putra</p>
                  <p className='text-sm'>081931386119</p>
                  <p className='text-sm'>Jl. Kelapa Hibrida Utara Blok GB.3/26 Sektor 6 Gading Serpong 15810, BANTEN</p>
                  <div className=" flex gap-2 mt-2">
                    <EditIcon className='text-green-600 size-5' />
                    <TrashIcon className='text-red-600 size-5' />
                  </div>
                </Card>
                <Card className="bg-white p-4 shadow-lg gap-1 flex flex-col">
                  <div className="flex items-start gap-2">
                    <p className="font-bold text-sm">JL. Kelapa Hibrida Utara Blok GB.3/26</p>
                    <FaMapMarkerAlt className="text-orange-500 mt-1" />
                  </div>
                  <p className='text-sm font-semibold'>Hendry Tjahaja Surijanto Putra</p>
                  <p className='text-sm'>081931386119</p>
                  <p className='text-sm'>Jl. Kelapa Hibrida Utara Blok GB.3/26 Sektor 6 Gading Serpong 15810, BANTEN</p>
                  <div className=" flex gap-2 mt-2">
                    <EditIcon className='text-green-600 size-5' />
                    <TrashIcon className='text-red-600 size-5' />
                  </div>
                </Card>
                <Card className="bg-white p-4 shadow-lg gap-1 flex flex-col">
                  <div className="flex items-start gap-2">
                    <p className="font-bold text-sm">JL. Kelapa Hibrida Utara Blok GB.3/26</p>
                    <FaMapMarkerAlt className="text-orange-500 mt-1" />
                  </div>
                  <p className='text-sm font-semibold'>Hendry Tjahaja Surijanto Putra</p>
                  <p className='text-sm'>081931386119</p>
                  <p className='text-sm'>Jl. Kelapa Hibrida Utara Blok GB.3/26 Sektor 6 Gading Serpong 15810, BANTEN</p>
                  <div className=" flex gap-2 mt-2">
                    <EditIcon className='text-green-600 size-5' />
                    <TrashIcon className='text-red-600 size-5' />
                  </div>
                </Card>
                <Card className="bg-white p-4 shadow-lg gap-1 flex flex-col">
                  <div className="flex items-start gap-2">
                    <p className="font-bold text-sm">JL. Kelapa Hibrida Utara Blok GB.3/26</p>
                    <FaMapMarkerAlt className="text-orange-500 mt-1" />
                  </div>
                  <p className='text-sm font-semibold'>Hendry Tjahaja Surijanto Putra</p>
                  <p className='text-sm'>081931386119</p>
                  <p className='text-sm'>Jl. Kelapa Hibrida Utara Blok GB.3/26 Sektor 6 Gading Serpong 15810, BANTEN</p>
                  <div className=" flex gap-2 mt-2">
                    <EditIcon className='text-green-600 size-5' />
                    <TrashIcon className='text-red-600 size-5' />
                  </div>
                </Card>
                <Card className="bg-white p-4 shadow-lg gap-1 flex flex-col">
                  <div className="flex items-start gap-2">
                    <p className="font-bold text-sm">JL. Kelapa Hibrida Utara Blok GB.3/26</p>
                    <FaMapMarkerAlt className="text-orange-500 mt-1" />
                  </div>
                  <p className='text-sm font-semibold'>Hendry Tjahaja Surijanto Putra</p>
                  <p className='text-sm'>081931386119</p>
                  <p className='text-sm'>Jl. Kelapa Hibrida Utara Blok GB.3/26 Sektor 6 Gading Serpong 15810, BANTEN</p>
                  <div className=" flex gap-2 mt-2">
                    <EditIcon className='text-green-600 size-5' />
                    <TrashIcon className='text-red-600 size-5' />
                  </div>
                </Card>
                <Card className="bg-white p-4 shadow-lg gap-1 flex flex-col">
                  <div className="flex items-start gap-2">
                    <p className="font-bold text-sm">JL. Kelapa Hibrida Utara Blok GB.3/26</p>
                    <FaMapMarkerAlt className="text-orange-500 mt-1" />
                  </div>
                  <p className='text-sm font-semibold'>Hendry Tjahaja Surijanto Putra</p>
                  <p className='text-sm'>081931386119</p>
                  <p className='text-sm'>Jl. Kelapa Hibrida Utara Blok GB.3/26 Sektor 6 Gading Serpong 15810, BANTEN</p>
                  <div className=" flex gap-2 mt-2">
                    <EditIcon className='text-green-600 size-5' />
                    <TrashIcon className='text-red-600 size-5' />
                  </div>
                </Card>
                <Card className="bg-white p-4 shadow-lg gap-1 flex flex-col">
                  <div className="flex items-start gap-2">
                    <p className="font-bold text-sm">JL. Kelapa Hibrida Utara Blok GB.3/26</p>
                    <FaMapMarkerAlt className="text-orange-500 mt-1" />
                  </div>
                  <p className='text-sm font-semibold'>Hendry Tjahaja Surijanto Putra</p>
                  <p className='text-sm'>081931386119</p>
                  <p className='text-sm'>Jl. Kelapa Hibrida Utara Blok GB.3/26 Sektor 6 Gading Serpong 15810, BANTEN</p>
                  <div className=" flex gap-2 mt-2">
                    <EditIcon className='text-green-600 size-5' />
                    <TrashIcon className='text-red-600 size-5' />
                  </div>
                </Card>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent >
      </Dialog >
      <Dialog open={openNewAddressForm} onOpenChange={() => {
        setOpenNewAddressForm(false)
        setOpenAddressListDialog(true)
      }}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-sm lg:max-w-4xl" onInteractOutside={(e) => {
          e.preventDefault();
        }}>
          <AddAddressForm onClose={handleAddAddressFormClose} />
        </DialogContent>
      </Dialog>

      <Dialog open={editAddressDialogOpen} onOpenChange={() => {
        setEditAddressDialogOpen(false)
        setOpenAddressListDialog(true)
      }}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-sm lg:max-w-4xl" onInteractOutside={(e) => {
          e.preventDefault();
        }}>
          <UpdateAddressForm onClose={handleEditAddressFormClose} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteModal onConfirm={handleDeleteAddress} onClose={handleCloseDeleteModal} description="Are you sure you want to delete the address?" />
      </AlertDialog>
    </>
  )
}

export default AddressCard