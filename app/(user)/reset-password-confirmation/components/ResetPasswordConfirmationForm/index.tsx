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
import CheckResetPasswordLinkValid from '@/hooks/CheckResetPasswordLinkValid';
import GenerateNewVerificationModal from '@/components/GenerateNewVerificationModal';
import GenerateNewResetPasswordLinkModal from '@/components/GenerateNewResetPasswordLinkModal';
import SetNewPassword from '@/hooks/SetNewPassword';
import Modal from '@/components/Modal';

type resetPasswordData = {
  password: string
  confirmPassword: string
}


const resetPasswordSchema: ZodType<resetPasswordData> = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ResetPasswordConfirmationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPasswordSuccessModal, setShowResetPasswordSuccessModal] = useState(false);
  const { AddNewPassword, isLoading } = SetNewPassword();
  const router = useRouter();
  const param = useSearchParams()
  const email = param.get('email');
  const token = param.get('token');
  const emailTokenObject = { "email": email, "token": token };
  console.log(emailTokenObject)
  const { resetPasswordLinkStatus, loading } = CheckResetPasswordLinkValid(emailTokenObject);
  console.log(resetPasswordLinkStatus)
  const { register, handleSubmit, formState: { errors }, setError } = useForm<resetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (showResetPasswordSuccessModal) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showResetPasswordSuccessModal, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prevState => !prevState);
  };


  const onSubmit = async (data: resetPasswordData) => {
    try {
      const formDataWithEmail = { ...data, email: email };
      const result = await AddNewPassword(formDataWithEmail)
      setShowResetPasswordSuccessModal(true)
    } catch (error) {
      console.log("Error")
    }
  }

  if (loading) {
    return <h1>Waiting</h1>
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <>
        {resetPasswordLinkStatus ? (<div className="w-4/5 max-w-[425px] bg-white p-6 rounded-lg shadow-md lg:w-full">
          <h1 className='text-2xl font-bold text-center'>Reset Password</h1>
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
          {showResetPasswordSuccessModal && (
            <Modal title='Your Password Has Been Successfully Reset!' description='You can now login with your Hii Mart account new password.' />
          )}
        </div>

        ) : <GenerateNewResetPasswordLinkModal email={email} description='The reset password link has expired. Please request a new reset password link.' title='Reset Password Link Has Expired!' />}

      </>
    </div>
  )
}

export default ResetPasswordConfirmationForm