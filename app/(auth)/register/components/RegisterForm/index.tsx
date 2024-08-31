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
import { useRouter, useSearchParams } from 'next/navigation';
import { AiOutlineMail, AiOutlinePhone, AiOutlineUser } from 'react-icons/ai';
import RegisterNewUser from '@/hooks/RegisterNewUser';
import Modal from '@/components/Modal';
import { signIn } from 'next-auth/react';
import { setCookie } from 'cookies-next';

type registerData = {
  email: string
  name: string
  phoneNumber: string
}

const loginSchema: ZodType<registerData> = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters'),
  phoneNumber: z.string()
    .min(12, 'Phone number must be at least 12 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
});
const RegisterForm = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const router = useRouter();
  const { AddNewUser, isLoading } = RegisterNewUser();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<registerData>({
    resolver: zodResolver(loginSchema),
  });
  const param = useSearchParams();

  useEffect(() => {
    if (isRegistered) {
      setTimeout(() => {
        setIsRegistered(false);
        router.push('/login');
      }, 6000);
    }
  }, [isRegistered, router]);

  useEffect(() => {
    const errorParam = param.get('error');
    if (errorParam === "email_already_registered") {
      setEmailExist(true);
      setTimeout(() => {
        setEmailExist(false);
      }, 4000);
      window.history.replaceState(null, '', '/register');
    } else if (errorParam === "null") {
      setIsRegistered(true);
    }
  }, [param]);


  const handleGoogleSignUp = async () => {
    try {
      setCookie('auth_action', "register")
      await signIn('google', {
        callbackUrl: '/'
      });
    } catch (error) {
      throw error
    }
  };

  const onSubmit = async (data: registerData) => {
    try {
      const formDataWithRole = { ...data, role: "USER" };
      console.log(formDataWithRole)
      const result = await AddNewUser(formDataWithRole)
      if (!result.error) {
        setIsRegistered(true)
      }
    } catch (error) {
      setEmailExist(true);
      setTimeout(() => {
        setEmailExist(false);
      }, 4000);
    }
  }
  return (
    <div className="flex justify-center items-center pt-10 pb-20">
      <div className="w-4/5 max-w-[400px] bg-white p-6 rounded-lg shadow-md lg:w-full">
        <div className="flex justify-between items-center">
          <h1 className='text-2xl font-bold mb-4'>Register</h1>
          <div className="relative">
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

          <div className="relative w-full">
            <input
              id="name"
              type="text"
              placeholder="Fullname"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('name')}
            />
            <AiOutlineUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {errors.name && <div className="text-red-500 text-xs">{errors.name.message}</div>}
          </div>

          <div className="relative w-full">
            <input
              id="phoneNumber"
              type="text"
              placeholder="Phone Number"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('phoneNumber')}
            />
            <AiOutlinePhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {errors.phoneNumber && <div className="text-red-500 text-xs">{errors.phoneNumber.message}</div>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 py-2 px-4 text-sm font-semibold w-full text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300"
          >
            {isLoading ? "Loading ... " : "REGISTER"}
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button className="flex items-center justify-center w-full border border-gray-300 rounded-md p-2 hover:bg-gray-50 transition duration-300">
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Logo"
            width={20}
            height={20}
            className="mr-2"
          />
          <span className="text-gray-700 text-sm" onClick={handleGoogleSignUp}>Register with Google</span>
        </button>
        <div className="text-center w-full text-sm mt-4">
          <span>Have an account? </span>
          <Link href="/login" className='text-blue-500 font-semibold hover:underline'>
            Login
          </Link>
        </div>
      </div>
      {isRegistered && (
        <Modal title="Verification Link Sent!" description=' A verification link has been sent to your email. Please check your inbox to verify your account.' />

      )}
      {emailExist && (
        <Modal title="Email Has Already Been Registered!" description='Please input another email for registration.' />
      )}
    </div>
  )
}

export default RegisterForm