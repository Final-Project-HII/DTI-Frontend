// import LeftNavbar from './_components/Navbar';

import NavBar from "@/components/NavBar";
import AdminLeftNavbar from "../admin/_components/AdminLeftNavbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hiimart Store - Manage Your Payments",
  description: "View and manage your payment methods at Hiimart Store. Keep your transactions secure and hassle-free.",
  keywords: ['manage payment', 'payment methods', 'Hiimart Store', 'online shopping'],
  openGraph: {
    title: "Manage Payment - Hiimart Store",
    description: "View and manage your payment methods at Hiimart Store. Keep your transactions secure and hassle-free.",
    url: '/manage-payment',
    siteName: 'Hiimart Store',
    images: [
      {
        url: '/hiimart v0.png',
        width: 800,
        height: 600,
        alt: 'Manage Payment at Hiimart Store',
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
