"use client";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import CategoryDummyData from "@/utils/CategoryDummyData";
import SkeletonCardCategory from "@/components/SkeletonCardCategory";

const CategoryList = () => {
  return (
    <div className="px-5 lg:px-40">
      <div className="bg-[#bbddff] p-5 rounded-xl">
        <h1 className="font-semibold text-lg">Product Category</h1>
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
          {CategoryDummyData.map((data, index) => (
            <SwiperSlide key={index} className="w-auto">
              {/* <SkeletonCardCategory /> */}
              <div className="flex flex-col gap-2 items-center">
                <div className="bg-white items-center p-5 w-24 rounded-xl shadow-md">
                  <Image
                    src={data.img}
                    width={1000}
                    height={1000}
                    alt=""
                    className="w-96 size-14 h-full"
                  />
                </div>
                <h2>{data.title}</h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategoryList;
