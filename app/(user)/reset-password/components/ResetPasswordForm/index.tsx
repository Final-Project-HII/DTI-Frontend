'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import qr from '@/public/QR.png'
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link';
import login from '@/app/(auth)/login/page';
import logoV3 from "@/public/LogoV3.png"
import { useRouter } from 'next/navigation';
import { ArrowBigLeft, ArrowLeft } from 'lucide-react';
import { AiOutlineMail } from 'react-icons/ai';
import SendResetPasswordLink from '@/hooks/SendResetPasswordLink';
import GenerateNewVerificationModal from '@/components/GenerateNewVerificationModal';
import Modal from '@/components/Modal';
type resetPasswordData = {
  email: string
}

const loginSchema: ZodType<resetPasswordData> = z.object({
  email: z.string().email('Invalid email address'),
});

const ResetPasswordForm = () => {
  const [isSuccessfull, setIsSuccessfull] = useState(false);
  const [isNotRegistered, setIsNotRegistered] = useState(false);
  const [isNotVerified, setIsNotVerified] = useState(false)
  const [email, setEmail] = useState<string>("")
  const router = useRouter();
  const { isLoading, AddNewResetPasswordLink } = SendResetPasswordLink();
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<resetPasswordData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isSuccessfull) {
      setTimeout(() => {
        setIsSuccessfull(false);
        router.push('/login');
      }, 6000);
    }
  }, [isSuccessfull, router]);

  const onSubmit = async (data: resetPasswordData) => {
    try {
      const result = await AddNewResetPasswordLink(data.email);
      console.log(result)
      if (result === "Success") {
        setIsSuccessfull(true)
      } else if (result === "Not Registered") {
        setIsNotRegistered(true);
        setTimeout(() => {
          setIsNotRegistered(false);
          reset()
        }, 6000);
      } else {
        setEmail(data.email);
        setIsNotVerified(true);
      }
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {isNotVerified ? (<GenerateNewVerificationModal email={email} title="You have not verified your account yet!" description='Please verify your account first before you can reset your password.' />) : (<div className="w-4/5 max-w-[400px] bg-white p-6 rounded-lg shadow-md lg:w-full">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <ArrowLeft size={25} onClick={() => router.push('/login')} />
            <h1 className='text-2xl font-bold  text-center z-20'>Reset Password</h1>
          </div>
          <div className="relative mt-3">
            <Image src={qr} width={45} height={5} alt='' />
            <div className="absolute p-3 w-full bg-white z-10 bottom-0 right-1/2"></div>
          </div>
        </div>
        <form className="flex flex-col gap-4 mt-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative w-full">
            <input
              id="email"
              type="text"
              placeholder="Email"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('email')}
            />
            <AiOutlineMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {errors.email && <div className="text-red-500 text-xs">{errors.email.message}</div>}
          </div>
          <button
            type="submit"
            className="mt-2 py-2 px-4 text-sm font-semibold w-full text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Loading ... " : "RESET PASSWORD"}
          </button>
        </form>
      </div>)}

      {isSuccessfull && (
        <Modal title='Reset Password Link Sent!' description='A reset password link has been sent to your email. Please check your inbox to reset your account password.' />
      )}
      {isNotRegistered && (
        <Modal title='Your Account Is Not Registered Yet!' description='Please register your account first and verify it first, if you want to reset your password.' />
      )}
    </div>
  )
}

export default ResetPasswordForm