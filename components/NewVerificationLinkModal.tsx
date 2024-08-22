import Image from 'next/image'
import React, { useEffect } from 'react'
import logoV3 from "@/public/LogoV3.png"

const NewVerificationLinkModal = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-20 p-5" >
      <div className="bg-white p-10 lg:p-20 rounded-md shadow-md flex flex-col gap-3 sm:max-w-[600px] ">
        <Image src={logoV3} width={200} height={200} alt='logoV3' />
        <h2 className="text-2xl font-bold">Verification link Sent!</h2>
        <p className="text-base"> A verification link has been sent to your email. Please check your inbox to verify your account.</p>
      </div>
    </div >
  )
}

export default NewVerificationLinkModal