
import React from 'react'
import Footer from "@/components/Footer";
import Image from "next/image";
import Carousel from "./_components/Carousel";
import CategoryList from "./_components/CategoryList";
import ReasonToShop from "./_components/ReasonToShop";
import DownloadApp from "./_components/DownloadApp";
import ProductList from "./_components/ProductList";
import NavBar from '@/components/NavBar';

const page = () => {
  return (
    <main className='pt-28'>
      <Carousel />
      <CategoryList />
      <ProductList />
      <ReasonToShop />
      <DownloadApp />
      <Footer />
    </main>
  );
}

export default page
