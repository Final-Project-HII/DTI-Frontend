'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import qr from '@/public/QR.png'
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logoV3 from "@/public/LogoV3.png"
import { useRouter, useSearchParams } from 'next/navigation';
import SetNewPassword from '@/hooks/SetNewPassword';
import CheckVerificationLinkValid from '@/hooks/CheckVerificationLinkValid';
import GenerateNewVerificationModal from '@/components/GenerateNewVerificationModal';
import Modal from '@/components/Modal';

type managePasswordData = {
  password: string
  confirmPassword: string
}

const managePasswordSchema: ZodType<managePasswordData> = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
const ManagePasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const { AddNewPassword, isLoading } = SetNewPassword();
  const router = useRouter();
  const param = useSearchParams()
  const email = param.get('email');
  const token = param.get('token');
  const emailTokenObject = { "email": email, "token": token };
  const { verificationStatus, loading } = CheckVerificationLinkValid(emailTokenObject);
  console.log(verificationStatus)
  const { register, handleSubmit, formState: { errors }, setError } = useForm<managePasswordData>({
    resolver: zodResolver(managePasswordSchema),
  });

  useEffect(() => {
    if (showVerifiedModal || verificationStatus === 'Verified') {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showVerifiedModal, verificationStatus, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prevState => !prevState);
  };


  const onSubmit = async (data: managePasswordData) => {
    try {
      const formDataWithEmail = { ...data, email: email };
      const result = await AddNewPassword(formDataWithEmail)
      if (result) {
        setShowVerifiedModal(true)
      }
    } catch (error) {
      console.log("Error")
    }
  }

  if (loading) {
    return <h1>Waiting</h1>
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {verificationStatus == "Not Verified" ? (
        <>
          <div className="w-4/5 max-w-[425px] bg-white p-6 rounded-lg shadow-md lg:w-full">
            <h1 className='text-2xl font-bold text-center'>Manage Password</h1>
            <h2 className='text-xs text-center text-gray-400 mb-6'>Fill up the form to set a new password</h2>
            <form className="flex flex-col gap-4 mt-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEye className="h-5 w-5 text-gray-600" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && <div className="text-red-500 text-xs">{errors.password.message}</div>}
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEye className="h-5 w-5 text-gray-600" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <div className="text-red-500 text-xs">{errors.confirmPassword.message}</div>}

              <button
                type="submit"
                className="mt-2 py-2 px-4 text-sm font-semibold w-full text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300"
              >
                {isLoading ? "Loading ... " : "SAVE PASSWORD"}
              </button>
            </form>
          </div>

          {showVerifiedModal && (
            <Modal title='Your Account Is Verified!' description='You can now login with your Hii Mart account.' />
          )}
        </>
      ) : verificationStatus === 'Verified' ? <Modal title='Your Account Is Verified!' description='You can now login with your Hii Mart account.' /> : (
        <GenerateNewVerificationModal email={email} description='The verification link has expired. Please request a new verification link.' title='Verification Link Has Expired!' />
      )}
    </div>
  )
}

export default ManagePasswordForm