import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { resetPassword } from '@/utils/api';
import Modal from '@/components/Modal';
import SetNewPassword from '@/hooks/SetNewPassword';

interface ResetPasswordFormProps {
  email: string | undefined,
  isResetPasswordFormOpen: boolean,
  setIsResetPasswordFormOpen: (isOpen: boolean) => void,
  onDataChange: () => void
}

const managePasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof managePasswordSchema>;

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  email,
  isResetPasswordFormOpen,
  setIsResetPasswordFormOpen,
  onDataChange
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const { AddNewPassword } = SetNewPassword()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(managePasswordSchema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const formDataWithEmail = { ...data, email: email };
      const response = await AddNewPassword(formDataWithEmail)
      if (response) {
        setIsLoading(false);
        onDataChange();
        setIsResetPasswordFormOpen(false);
        setShowVerifiedModal(true);
        setTimeout(() => {
          setShowVerifiedModal(false);
        }, 3000);
      }
    } catch (error) {
      console.log("Error")
    }
  };

  const PasswordInput = ({ name, label, placeholder }: { name: "password" | "confirmPassword", label: string, placeholder: string }) => (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>
      <div className="relative">
        <Input
          id={name}
          type={(name === 'password' ? showPassword : showConfirmPassword) ? "text" : "password"}
          placeholder={placeholder}
          {...register(name)}
          className="w-full"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
        >
          {(name === 'password' ? showPassword : showConfirmPassword) ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {errors[name] && <p className="text-sm text-red-500">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <>
      <Dialog open={isResetPasswordFormOpen} onOpenChange={setIsResetPasswordFormOpen}>
        <DialogContent onInteractOutside={(e) => {
          e.preventDefault();
        }} className='max-w-sm lg:max-w-md'>
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-xl">Reset Password</DialogTitle>
          </DialogHeader>
          <div className="py-5 flex justify-center">
            <Image src="/security-logo.png" width={150} height={150} alt='security-logo' />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <PasswordInput name="password" label="New Password" placeholder="Enter your new password" />
            <PasswordInput name="confirmPassword" label="Confirm New Password" placeholder="Confirm your new password" />
            <Button type="submit" className="w-full text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300" disabled={isLoading}>
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      {showVerifiedModal && (
        <Modal title='Your Password Has Been Successfully Changed!' description='You can now login with your new password.' />
      )}

    </>
  );
};

export default ResetPasswordForm;