'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import qr from '@/public/QR.png'
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';
import { signIn } from 'next-auth/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Modal from '@/components/Modal';
import GenereteNewVerificationModalLogin from '@/components/GenereteNewVerificationModalLogin';
import { setCookie } from 'cookies-next';

type loginData = {
  email: string
  password: string
}

const loginSchema: ZodType<loginData> = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
});
const LoginForm = () => {
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<loginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isNotVerified, setIsNotVerified] = useState(false);
  const [email, setEmail] = useState("")
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };
  const router = useRouter();
  const param = useSearchParams();

  useEffect(() => {
    const errorParam = param.get('error');
    if (errorParam == "email_not_found") {
      setIsRegistered(true)
      setTimeout(() => setIsRegistered(false), 4000);
      window.history.replaceState(null, '', '/login');
    } else if (errorParam == "email_not_verified") {
      const emailParam = param.get('email');
      if (emailParam !== null) {
        setEmail(emailParam);
      }
      setIsNotVerified(true)
    } else if (errorParam == "password_not_correct") {
      setErrorModal(true)
      setTimeout(() => setErrorModal(false), 4000);
      window.history.replaceState(null, '', '/login');
    }
  }, [param]);



  const handleSocialLogin = async () => {
    try {
      const result = await signIn("google", {
        state: "login"
      });
      console.log(result)
    } catch (error) {
      throw error
    }

  }


  const onSubmit = async (data: loginData) => {
    try {
      setCookie('auth_action', "login")
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  }

  const closeModal = () => {
    setIsNotVerified(false);
    router.push("/login")
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-4/5 max-w-[425px] bg-white p-6 rounded-lg shadow-md lg:w-full">
        <div className="flex justify-between items-center">
          <h1 className='text-2xl font-bold mb-4'>Login</h1>
          <div className="relative">
            <Image src={qr} width={45} height={5} alt='' />
            <div className="absolute p-3 w-full bg-white z-20 bottom-0 right-1/2"></div>
          </div>
        </div>
        <form className="flex flex-col gap-4 mt-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative w-full">
            <input
              id="email"
              type="text"
              placeholder="Email"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
              {...register('email')}
            />
            <AiOutlineMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          {errors.email && <div className="text-red-500 text-xs">{errors.email.message}</div>}
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
          <button
            type="submit"
            className="mt-2 py-2 px-4 text-sm font-semibold w-full text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300"
          >
            LOGIN
          </button>
        </form>
        <Link href="/reset-password" className='text-xs text-blue-500 font-semibold mt-2 hover:underline'>
          Forgot Password
        </Link>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button onClick={handleSocialLogin} className="flex items-center justify-center w-full border border-gray-300 rounded-md p-2 hover:bg-gray-50 transition duration-300">
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Logo"
            width={20}
            height={20}
            className="mr-2"
          />
          <span className="text-gray-700 text-sm">Login with Google</span>
        </button>
        <div className="text-center w-full text-sm mt-4">
          <span>New in Hii Mart? </span>
          <Link
            href="/register" className='text-blue-500 font-semibold hover:underline'>
            Register
          </Link>
        </div>
      </div>
      {errorModal && <Modal title="Password Is Wrong!" description='Please input your password correctly.' />}
      {isRegistered && <Modal title="Email is not registered yet!" description='Please register your email first, before you login.' />}
      {isNotVerified && <GenereteNewVerificationModalLogin email={email} title="You Have Not Verified Your Account Yet!" description='Please verify your account first before you can login with ' closeModal={closeModal} reset={reset} />}
    </div>
  )
}

export default LoginForm