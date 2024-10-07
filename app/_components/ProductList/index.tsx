"use client";
import React, { useState } from "react";
import { ProductCard } from "@/app/(user)/(main)/product/_components/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import ProductListSkeleton from "./ProductListSkeleton";

// Import Swiper styles
import "swiper/css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
// import { Product } from '@/types/product';
import { useQuery } from "@tanstack/react-query";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;

interface ProductListProps {
  category?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: number;
  categoryId: number;
  categoryName: string;
  totalStock: number;
  productImages: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const fetchProducts = async (category?: string): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (category) params.set("categoryName", category);
  params.set("size", "10"); // Limit to 10 products for the slider

  const response = await axios.get<{ content: Product[] }>(
    `${BASE_URL}/product?${params.toString()}`
  );
  return response.data.content;
};

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products", category],
    queryFn: () => fetchProducts(category),
  });

  if (isLoading) return <div><ProductListSkeleton /></div>;
  if (error) return <div>Error loading products: {error.message}</div>;
  const sortedProducts = products?.sort((a, b) => (a.totalStock === 0 ? 1 : -1));

  return (
    <div className="px-5 py-2 rounded-xl lg:px-16">
      <div className="bg-white rounded-xl p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-lg">{category ? `${category} Products` : 'All Products'}</h1>
          <Link href={`/product?page=0&category=${category}`}>
            <h2 className="text-blue-600">See all</h2>
          </Link>
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          slidesPerView={2}
          className="w-full"
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          breakpoints={{
            640: {
              slidesPerView: 2.5,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 5,
            },
            1280: {
              slidesPerView: 6,
            },
            1536: {
              slidesPerView: 8,
            },
          }}
        >
          {sortedProducts?.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="h-full">
                <ProductCard product={product} />
              </div>
            </SwiperSlide>
          ))}
          <button
            className={`absolute swiper-button-prev bottom-1/2 border-2 border-blue-600 left-0 z-10 p-1 bg-white translate-y-1/2 md:p-2 rounded-full font-bold transition-opacity duration-300 ${isBeginning ? "opacity-0" : "opacity-100"
              }`}
            style={{ pointerEvents: isBeginning ? "none" : "auto" }}
          >
            <FaChevronLeft className="text-blue-600" />
          </button>
          <button
            className={`absolute swiper-button-next bottom-1/2 border-2 border-blue-600 right-0 z-10 p-1 bg-white translate-y-1/2 md:p-2 rounded-full font-bold transition-opacity duration-300 ${isEnd ? "opacity-0" : "opacity-100"
              }`}
            style={{ pointerEvents: isEnd ? "none" : "auto" }}
          >
            <FaChevronRight className="text-blue-600" />
          </button>
        </Swiper>
      </div>
    </div>
  );
};

export default ProductList;
