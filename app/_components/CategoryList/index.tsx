"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CategoryItem from './CategoryItem'
import CategoryItemSkeleton from "./CategoryItemSkeleton";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;


interface Category {
  id: number;
  name: string;
  categoryImage: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`${BASE_URL}/category`);
  return response.data;
};

const CategoryListSkeleton = () => {
  return (
    <div className="px-5 sm:px-4 lg:px-16 mb-4">
      <div className="bg-[#bbddff] p-2 sm:p-3 lg:p-5 rounded-xl">
        <h1 className="font-semibold text-sm sm:text-base lg:text-lg mb-2">Product Categories</h1>
        <div className="flex overflow-x-auto lg:gap-7 gap-2 flex-nowrap">
          {Array(12).fill(null).map((_, index) => (
            <CategoryItemSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryList = () => {
  const { data: categories, isLoading, error } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <div><CategoryListSkeleton /></div>;
  if (error) return <div>Error loading categories: {error.message}</div>;

  return (
    <div className="px-5 sm:px-4 lg:px-16 mb-4">
      <div className="bg-[#bbddff] p-2 sm:p-3 lg:p-5 rounded-xl">
        <h1 className="font-semibold text-sm sm:text-base lg:text-lg mb-2">Product Categories</h1>

        <Swiper
          slidesPerView={5}
          spaceBetween={0}
          freeMode={true}
          modules={[FreeMode]}
          className="mt-2"
          breakpoints={{
            320: { slidesPerView: 5.5, spaceBetween: 0 },
            640: { slidesPerView: 8, spaceBetween: 5 },
            768: { slidesPerView: 10, spaceBetween: 12 },
            1024: { slidesPerView: 12, spaceBetween: 16 },
          }}
        >
          {categories?.map((category) => (
            <SwiperSlide key={category.id} className='mr-0'>
              <CategoryItem category={category} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategoryList;