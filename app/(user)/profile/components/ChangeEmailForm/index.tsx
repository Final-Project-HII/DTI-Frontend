import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import Modal from '@/components/Modal';
import { changeEmail } from '@/utils/api';
import { signOut, useSession } from 'next-auth/react';

interface ChangeEmailFormProps {
  email: string | undefined,
  isChangeEmailFormOpen: boolean,
  setIsChangeEmailFormOpen: (isOpen: boolean) => void,
  onDataChange: () => void
}

const changeEmailSchema = z.object({
  newEmail: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof changeEmailSchema>;

const ChangeEmailForm: React.FC<ChangeEmailFormProps> = ({
  email,
  isChangeEmailFormOpen,
  setIsChangeEmailFormOpen,
  onDataChange
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { data: session } = useSession();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(changeEmailSchema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await changeEmail(data, session!.user.accessToken)
      console.log(response)
      if (response) {
        setIsLoading(false);
        onDataChange();
        setIsChangeEmailFormOpen(false);
        setShowVerifiedModal(true);
        setTimeout(() => {
          setShowVerifiedModal(false);
          signOut()
        }, 3000);
      }
    } catch (error) {
      setIsLoading(false);
      setIsChangeEmailFormOpen(false);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
        setTimeout(() => {
          setIsChangeEmailFormOpen(true);
        }, 100);
      }, 3000);

    }
  };

  return (
    <>
      <Dialog open={isChangeEmailFormOpen} onOpenChange={setIsChangeEmailFormOpen}>
        <DialogContent onInteractOutside={(e) => {
          e.preventDefault();
        }} className='max-w-sm lg:max-w-md'>
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-xl">Change Email</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="currentEmail" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Current Email</label>
              <Input
                id="currentEmail"
                type="email"
                value={email}
                disabled
                className="w-full bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="newEmail" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">New Email</label>
              <Input
                id="newEmail"
                type="email"
                placeholder="Enter your new email"
                {...register("newEmail")}
                className="w-full"
              />
              {errors.newEmail && <p className="text-sm text-red-500">{errors.newEmail.message}</p>}
            </div>
            <Button type="submit" className="w-full text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300" disabled={isLoading}>
              {isLoading ? "Loading..." : "Change Email"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      {showVerifiedModal && (
        <Modal title='Your Email Has Been Successfully Changed!' description='Please check your new email to verify your account.' />
      )}
      {showErrorModal && (
        <Modal title="Email Has Already Been Registered!" description='Please input another email.' />
      )}
    </>
  );
};

export default ChangeEmailForm;