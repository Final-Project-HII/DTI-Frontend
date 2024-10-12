// import LeftNavbar from './_components/Navbar';

import NavBar from "@/components/NavBar";
import AdminLeftNavbar from "../admin/_components/AdminLeftNavbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hiimart Store - Secure Checkout for Fast & Easy Shopping",
  description: "Complete your purchase securely at Hiimart Store. Enjoy fast and easy shopping with exclusive deals tailored for you.",
  keywords: ['checkout', 'purchase', 'Hiimart Store', 'online shopping'],
  openGraph: {
    title: "Checkout - Hiimart Store",
    description: "Complete your purchase securely at Hiimart Store. Enjoy fast and easy shopping with exclusive deals tailored for you.",
    url: '/checkout',
    siteName: 'Hiimart Store',
    images: [
      {
        url: '/hiimart v0.png',
        width: 800,
        height: 600,
        alt: 'Secure Checkout at Hiimart Store',
      },
    ],
    type: 'website',
  },
};

export interface ProductLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ProductLayoutProps) {
  return (
    <div className="flex">
      <NavBar />
      {/* <AdminLeftNavbar /> */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
