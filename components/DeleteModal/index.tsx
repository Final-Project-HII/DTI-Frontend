import React from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

interface ModalProps {
  onConfirm: () => void;
  onClose: () => void;
  description: string
}
import { Button } from "@/components/ui/button"
const DeleteModal: React.FC<ModalProps> = ({ onConfirm, onClose, description }) => {
  return (
    <AlertDialogContent className="max-w-sm mx-auto p-6 lg:max-w-lg">
      <AlertDialogHeader>
        <AlertDialogTitle className='text-red-600 text-center'>Are You Sure?</AlertDialogTitle>
        <hr />
        <AlertDialogDescription className='text-center'>
          {description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="flex w-full items-center lg:flex-row gap-2 justify-center">
        <Button onClick={onClose} className='bg-[#BE202F] text-white font-bold px-6 py-3 w-full lg:w-auto lg:px-10 lg:py-5'>
          No
        </Button>
        <Button onClick={onConfirm} className='bg-[#4DB163] text-white font-bold px-6 py-3 w-full lg:w-auto lg:px-10 lg:py-5'>
          Yes
        </Button>
      </div>
    </AlertDialogContent>
  )
}

export default DeleteModal