'use client'
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import promoBanner from '@/utils/PromoBanner';
import Image from 'next/image';
import { ArrowLeft, ArrowLeftCircle, ArrowRightCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';



const Carousel = () => {
  return (
    <main className=' p-5 lg:px-20 lg:py-10'>
      <div className="justify-center items-center lg:px-20">
        <Swiper
          slidesPerView={1.3}
          initialSlide={1}
          loop={true}
          centeredSlides={true}
          spaceBetween={10}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },

            768: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: 1.3,
            },
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
          }}
          modules={[Pagination, Navigation]}
          className="relative"
        >
          {promoBanner.map((banner) => (
            <SwiperSlide>
              <Image src={banner.img} alt='banner'
                className='h-full w-full rounded-xl'
              />
            </SwiperSlide>
          ))}
          <button className="absolute swiper-button-prev bottom-1/2 left-2 md:left-[13%] z-10 p-1 bg-white translate-y-1/2 md:p-2  rounded-full font-bold" >
            <FaChevronLeft className='text-blue-600' />
          </button>
          <button className="absolute swiper-button-next bottom-1/2  right-2 md:right-[13%] z-10 p-1 bg-white translate-y-1/2 md:p-2  rounded-full font-bold" >
            <FaChevronRight className='text-blue-600' />
          </button>
        </Swiper>
      </div>
    </main>
  )
}

export default Carousel