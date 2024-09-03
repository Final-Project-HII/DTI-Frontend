
import React from 'react'
import Footer from "@/components/Footer";
import Image from "next/image";
import Carousel from "./_components/Carousel";
import CategoryList from "./_components/CategoryList";
import ReasonToShop from "./_components/ReasonToShop";
import DownloadApp from "./_components/DownloadApp";
import ProductList from "./_components/ProductList";
import Header from '@/components/Header';

const page = () => {
  return (
    <>
      <Header />
      <div className="pt-20">
        <Carousel />
        <CategoryList />
        <ProductList category="Food" />
        <ProductList category="Drink" />
        <ProductList category="Fresh" />
        <ReasonToShop />
        <DownloadApp />
        <Footer />
      </div>
    </>
  );
}

export default page
