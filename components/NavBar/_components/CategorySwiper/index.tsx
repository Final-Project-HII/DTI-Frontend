'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

const BASE_URL = 'http://localhost:8080/api';
interface Category {
  id: number;
  name: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`${BASE_URL}/category`);
  return response.data;
};

const CategorySwiper = () => {
  const { data: categories, isLoading, error } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories: {error.message}</div>;
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={6}
      freeMode={true}
      grabCursor={true}
      modules={[FreeMode]}
      breakpoints={{
        320: {
          slidesPerView: 5,
        },

        768: {
          slidesPerView: 6,
        },
      }}
    >
      {categories?.map((category) => (
        <SwiperSlide key={category.id} className="w-auto">
          <Link href={`/product?page=0&category=${category.name}`}>
            <h2 className="text-gray-800 text-sm text-center flex-nowrap items-center">{category.name}</h2>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default CategorySwiper