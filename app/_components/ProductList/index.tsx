'use client'
import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductList = () => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  return (
    <div className="px-5 py-10 rounded-xl lg:px-40">
      <div className="bg-white rounded-xl p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-lg">All Products</h1>
          <h2 className="text-blue-600">See all</h2>
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          slidesPerView={2}
          className='w-full'
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 5,
            },
          }}

        >
          {[...Array(10)].map((_, index) => (
            <SwiperSlide key={index}>
              <ProductCard />
            </SwiperSlide>
          ))}
          <button
            className={`absolute swiper-button-prev bottom-1/2 border-2 border-blue-600 left-0 z-10 p-1 bg-white translate-y-1/2 md:p-2 rounded-full font-bold transition-opacity duration-300 ${isBeginning ? 'opacity-0' : 'opacity-100'}`}
            style={{ pointerEvents: isBeginning ? 'none' : 'auto' }}
          >
            <FaChevronLeft className='text-blue-600' />
          </button>
          <button
            className={`absolute swiper-button-next bottom-1/2 border-2 border-blue-600 right-0 z-10 p-1 bg-white translate-y-1/2 md:p-2 rounded-full font-bold transition-opacity duration-300 ${isEnd ? 'opacity-0' : 'opacity-100'}`}
            style={{ pointerEvents: isEnd ? 'none' : 'auto' }}
          >
            <FaChevronRight className='text-blue-600' />
          </button>
        </Swiper>
      </div>
    </div>
  );
};

export default ProductList;