// import LeftNavbar from './_components/Navbar';

import NavBar from "@/components/NavBar";
import AdminLeftNavbar from "../admin/_components/AdminLeftNavbar";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hiimart Store - Payment Process",
  description: "Track your payment for your order at Hiimart Store. Complete your payment securely and check the payment status.",
  keywords: ['payment process', 'Hiimart Store', 'track payment', 'order status'],
  openGraph: {
    title: "Payment Process - Hiimart Store",
    description: "Track your payment for your order at Hiimart Store. Complete your payment securely and check the payment status.",
    url: '/payment-process',
    siteName: 'Hiimart Store',
    images: [
      {
        url: '/hiimart v0.png',
        width: 800,
        height: 600,
        alt: 'Payment Process at Hiimart Store',
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
      {/* <NavBar /> */}
      {/* <AdminLeftNavbar /> */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
