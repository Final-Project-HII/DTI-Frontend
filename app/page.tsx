import React from "react";
import Footer from "@/components/Footer";
import Carousel from "./_components/Carousel";
import CategoryList from "./_components/CategoryList";
import ReasonToShop from "./_components/ReasonToShop";
import DownloadApp from "./_components/DownloadApp";
import ProductList from "./_components/ProductList";
import NavBar from "@/components/NavBar";

const page = () => {
  return (
    <>
      <div className="pt-20">
        <Carousel />
        <CategoryList />
        <ProductList category="Food" />
        <ProductList category="Snack" />
        <ProductList category="Drink" />
        <ReasonToShop />
        <DownloadApp />
        <Footer />
      </div>
    </>
  );
};

export default page;
