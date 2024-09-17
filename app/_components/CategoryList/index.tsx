'use client'
import Image from 'next/image'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import CategoryDummyData from '@/utils/CategoryDummyData'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import SkeletonCardCategory from '@/components/SkeletonCardCategory'

const BASE_URL = 'http://localhost:8080/api';

interface Category {
  id: number;
  name: string;
  categoryImage: string;
}
const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`${BASE_URL}/category`);
  return response.data;
};

const CategoryList = () => {
  const { data: categories, isLoading, error } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  if (isLoading) return <div>Loading categories...</div>;
  // if (isLoading) return <div><SkeletonCardCategory /></div>;
  if (error) return <div>Error loading categories: {error.message}</div>;

  return (
    <div className="px-5 lg:px-40 mb-7">
      <div className='bg-[#bbddff] p-5 rounded-xl'>
        <h1 className='font-semibold text-lg'>Product Category</h1>
        <Swiper
          slidesPerView={10}
          spaceBetween={20}
          freeMode={true}
          modules={[FreeMode]}
          className="mt-3"
          breakpoints={{
            320: {
              slidesPerView: 3,
            },

            768: {
              slidesPerView: 5,
            },
            1024: {
              slidesPerView: 10,
            },
          }}
        >
          {categories?.map((category) => (
            <SwiperSlide key={category.id} className="w-auto">
              <div className='flex flex-col gap-2 items-center'>
                {/* http://localhost:3000/product?page=0&categoryName=Milk */}
                <Link href={`/product?page=0&category=${category.name}`}>
                  <div className="bg-white items-center p-5 w-24 rounded-xl shadow-md">
                    <Image
                      src={category.categoryImage ? category.categoryImage.startsWith('http') ? category.categoryImage : `https://res.cloudinary.com/dcjjcs49e/image/upload/${category.categoryImage}` : "/food.png"}
                      width={1000}
                      height={1000}
                      alt={category.name}
                      className='w-96 size-14'
                    />
                  </div>
                </Link>
                <h2 className="text-center">{category.name}</h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default CategoryList