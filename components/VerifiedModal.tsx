import React from 'react'
import logoV3 from "@/public/LogoV3.png"
import Image from 'next/image'


const VerifiedModal = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-20 p-5">
      <div className="bg-white p-10 lg:p-20 rounded-md shadow-md flex flex-col gap-3 sm:max-w-[600px] ">
        <Image src={logoV3} width={200} height={200} alt='logoV3' />
        <h2 className="text-2xl font-bold">Your account is verified!</h2>
        <p className="text-base">You can now login with your Hii Mart account</p>
      </div>
    </div>
  )
}

export default VerifiedModal