import React from 'react'
import google from '@/public/google-app.png'
import apple from '@/public/app-store.png'
import gallery from '@/public/app-gallery.png'
import Image from 'next/image'
import hp from '@/public/hp.png'
const DownloadApp = () => {
  return (
    <div className='py-16 px-5  bg-yellow-400 flex-col flex gap-4 relative lg:px-20' style={{ backgroundImage: `url('https://cdn.klikindomaret.com/image/bg_footer2.webp')` }}>
      <h1 className='font-semibold text-xl lg:text-2xl text-[#0079C2]'>Enjoy the best shopping experience for your needs through the Hii Mart application</h1>
      <h2 className='font-semibold text-xl lg:text-2xl text-[#0079C2]'>Download the Hii Mart application now!</h2>
      {/* responsify */}
      <div className="flex items-center gap-2 lg:gap-5 mb-24 lg:mb-0 w-full">
        <Image src={google} width={200} height={200} alt='' />
        <Image src={apple} width={200} height={200} alt='' />
        <Image src={gallery} width={200} height={200} alt='' />
      </div>
      <Image src={hp} width={380} height={1000} alt='' className='absolute right-1/2 translate-x-1/2 bottom-0 size-40 lg:size-80 lg:right-10 lg:translate-x-0' />
    </div>
  )
}

export default DownloadApp