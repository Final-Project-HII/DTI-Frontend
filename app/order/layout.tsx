// import LeftNavbar from './_components/Navbar';

import NavBar from "@/components/NavBar";
import AdminLeftNavbar from "../admin/_components/AdminLeftNavbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hiimart Store - Your Orders",
  description: "View and manage your orders at Hiimart Store. Track your order status and find your purchase history.",
  keywords: ['my orders', 'order history', 'Hiimart Store', 'track order'],
  openGraph: {
    title: "Your Orders - Hiimart Store",
    description: "View and manage your orders at Hiimart Store. Track your order status and find your purchase history.",
    url: '/orders',
    siteName: 'Hiimart Store',
    images: [
      {
        url: '/hiimart v0.png',
        width: 800,
        height: 600,
        alt: 'Your Orders at Hiimart Store',
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
