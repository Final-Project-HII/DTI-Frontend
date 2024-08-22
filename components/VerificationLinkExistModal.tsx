import Image from 'next/image'
import React from 'react'
import logoV3 from "@/public/LogoV3.png"

const VerificationLinkExistModal = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-20 p-5" >
      <div className="bg-white p-10 lg:p-20 rounded-md shadow-md flex flex-col gap-3 sm:max-w-[600px] ">
        <Image src={logoV3} width={200} height={200} alt='logoV3' />
        <h2 className="text-2xl font-bold">Verification link exist!</h2>
        <p className="text-base"> A verification link has already exist in your email. Please check your latest inbox to verify your account.</p>
      </div>
    </div >
  )
}

export default VerificationLinkExistModal