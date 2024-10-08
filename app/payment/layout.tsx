// import LeftNavbar from './_components/Navbar';

import NavBar from "@/components/NavBar";
import AdminLeftNavbar from "../admin/_components/AdminLeftNavbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hiimart Store - Secure Payment",
  description: "Complete your purchase securely at Hiimart Store. Choose your preferred payment method and finalize your order.",
  keywords: ['payment', 'checkout', 'Hiimart Store', 'secure payment', 'finalize order'],
  openGraph: {
    title: "Secure Payment - Hiimart Store",
    description: "Complete your purchase securely at Hiimart Store. Choose your preferred payment method and finalize your order.",
    url: '/payment',
    siteName: 'Hiimart Store',
    images: [
      {
        url: '/hiimart v0.png',
        width: 800,
        height: 600,
        alt: 'Secure Payment at Hiimart Store',
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
