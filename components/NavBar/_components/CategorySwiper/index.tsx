import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

const CategorySwiper = () => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Electronics', 'Clothing', 'Books', 'Home & Garden'];
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={6}
      freeMode={true}
      grabCursor={true}
      breakpoints={{
        320: {
          slidesPerView: 4,
        },

        768: {
          slidesPerView: 6,
        },
      }}
    >
      {categories.map((category, index) => (
        <SwiperSlide key={index} className="w-auto">
          <h2 className="text-black">{category}</h2>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default CategorySwiper