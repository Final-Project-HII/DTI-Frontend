import Image from 'next/image'
import React from 'react'
import logo from '@/public/LogoV3.png'
import verifyLogo from '@/public/verifyLogo.png'
import { BsTelephone } from 'react-icons/bs'
import { MailIcon } from 'lucide-react'
import { IoLogoFacebook } from 'react-icons/io'
import { AiFillTikTok } from 'react-icons/ai'
import { FaInstagram } from 'react-icons/fa'
import jne from "@/public/jneExpress.png"
import pos from "@/public/posIndonesia.png"
import bca from '@/public/BCA.png'
import bni from '@/public/BNI.png'
import bri from '@/public/BRI.png'
import gopay from '@/public/Gopay.png'
import mandiri from '@/public/Mandiri.png'
import masterCard from '@/public/MasterCard.png'
import niaga from '@/public/Niaga.png'
import ovo from '@/public/OVO.png'
import permata from '@/public/Permata.png'
import visa from '@/public/Visa.png'
import tiki from '@/public/tiki.png'


const Footer = () => {
  return (
    <div className='p-5  lg:px-40 lg:py-10'>
      <div className="grid grid-cols-1 gap-10 lg:gap-20 lg:grid-cols-5">
        <div className="flex flex-col gap-4 col-span-2">
          <Image alt="logo" src={logo} width={150} height={150} />
          <p className='text-base text-gray-500'>Hii Mart, Your one-stop destination for all your shopping needs. Explore a wide range of products with fast delivery and secure checkout, bringing convenience right to your doorstep.</p>
        </div>
        <div className="flex flex-col gap-4 col-span-2 lg:justify-self-center">
          <h1 className='font-bold text-xl'>Customer Service</h1>
          <div className="flex flex-col gap-3 text-gray-500">
            <div className="flex items-center gap-2">
              <BsTelephone size={20} />
              <div className="flex flex-col text-base">
                <h2>(021) 1523322</h2>
                <h2>(Monday - Sunday, 08.00 - 17.00 WIB)</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon size={20} />
              <div className="flex flex-col text-base">
                <h2>HiiMart@gmail.com</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 ">
          <h1 className='font-bold text-xl'>Shopping Security</h1>
          <Image alt="verifyLogo" src={verifyLogo} width={100} height={100} />
          <h2 className='font-bold text-xl'>Find Us In</h2>
          <div className="logo flex gap-2 items-end">
            <IoLogoFacebook className='text-blue-800' size={20} />
            <AiFillTikTok size={20} />
            <FaInstagram size={20} className='text-pink-500' />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-8 lg:mt-4">
        <div className="payment flex flex-col gap-4">
          <h2 className='font-bold text-xl'>Payment Method</h2>
          <div className="flex flex-wrap gap-8 items-center">
            <Image src={bni} alt='BNI' width={50} height={80} className='object-cover' />
            <Image src={bca} alt='BCA' width={60} height={80} />
            <Image src={bri} alt='BRI' width={80} height={80} />
            <Image src={mandiri} alt='Mandiri' width={70} height={80} />
            <Image src={niaga} alt='Niaga' width={80} height={80} />
            <Image src={permata} alt='Permata' width={80} height={80} />
            <Image src={gopay} alt='Gopay' width={80} height={80} />
            <Image src={masterCard} alt='MasterCard' width={40} height={80} />
            <Image src={ovo} alt='OVO' width={50} height={80} />
            <Image src={visa} alt='Visa' width={50} height={80} />
          </div>
        </div>
        <div className="service flex flex-col gap-4">
          <h2 className='font-bold text-xl'>Delivery Service</h2>
          <div className="flex  flex-wrap gap-4">
            <Image src={pos} alt='pos Indonesia' width={60} height={30} />
            <Image src={jne} alt='JNE Indonesia' width={60} height={30} />
            <Image src={tiki} alt='Tiki' width={60} height={30} />
          </div>
        </div>
        <hr></hr>
      </div>
      <h3 className='text-gray-400 text-center font-extralight text-[11px] mt-4'>Copyright © 2024 Hii Mart</h3>
    </div >
  )
}

export default Footer