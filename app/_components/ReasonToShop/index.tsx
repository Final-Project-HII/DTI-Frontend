import Image from 'next/image'
import React from 'react'
import easy_shop from '@/public/easy_shopping_icon.webp.png'
import delivery_icon from '@/public/delivery_one_hour_icon.webp.png'
import free_delivery_icon from '@/public/free_ongkir_icon.webp.png'
import easy_to_take from '@/public/take_at_store.webp.png'
import easy_payment from '@/public/payment_easy.webp.png'
import payment_directly from '@/public/payment_store.webp.png'

const ReasonToShop = () => {
  return (
    <div className=' px-5 py-10 bg-white text-center flex flex-col gap-6 lg:px-64'>
      <h1 className='text-2xl font-semibold'>Why Shop at Hii Mart?</h1>
      <div className="grid grid-cols-2 gap-4 justify-center items-center lg:grid-cols-5">
        <div className="flex flex-col gap-2 items-center ">
          <Image src={easy_shop} width={120} height={120} alt='' />
          <h2 className='w-4/5'>Shop Online with Ease</h2>
        </div>
        <div className="flex flex-col gap-2 items-center ">
          <Image src={delivery_icon} width={120} height={120} alt='' />
          <h2 className='w-4/5'>1-Hour Express Delivery</h2>
        </div>
        <div className="flex flex-col gap-2 items-center ">
          <Image src={free_delivery_icon} width={120} height={120} alt='' />
          <h2 className='w-4/5'>Free Shipping</h2>
        </div>
        <div className="flex flex-col gap-2 items-center ">
          <Image src={easy_to_take} width={120} height={120} alt='' />
          <h2 className='w-4/5'>Pick Up Your Order In-Store</h2>
        </div>
        <div className="flex flex-col gap-2 items-center ">
          <Image src={payment_directly} width={120} height={120} alt='' />
          <h2 className='w-4/5'>Easy Payment</h2>
        </div>
      </div>
    </div>
  )
}

export default ReasonToShop