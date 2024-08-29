
import Footer from "@/components/Footer";
import Image from "next/image";
import Carousel from "./_components/Carousel";
import CategoryList from "./_components/CategoryList";
import ReasonToShop from "./_components/ReasonToShop";
import DownloadApp from "./_components/DownloadApp";
import ProductList from "./_components/ProductList";


export default function Home() {
  return (
    <>
      <Carousel />
      <CategoryList />
      <ProductList />
      <ReasonToShop />
      <DownloadApp />
      <Footer />
    </>
  );
}
