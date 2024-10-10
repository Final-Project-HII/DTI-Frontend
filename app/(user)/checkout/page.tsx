import NavBar from "@/components/NavBar";
import CheckoutData from "./_components/CheckoutData";
import React from "react";
import { Metadata } from 'next';
import { metadata as rootMetadata } from '@/app/layout';

const keywords = Array.isArray(rootMetadata.keywords) ? rootMetadata.keywords : [];

export const metadata: Metadata = {
  ...rootMetadata,
  title: "Checkout - Hiimart Store",
  description: "Complete your purchase securely at Hiimart Store. Review your order and enjoy fast delivery.",
  keywords: [...keywords, 'checkout', 'purchase', 'order review', 'Hiimart Store'],
  openGraph: {
    ...rootMetadata.openGraph,
    title: "Checkout - Hiimart Store",
    description: "Securely complete your purchase at Hiimart Store and review your order details.",
    url: '/checkout',
  },
};
const CheckoutPage: React.FC = () => {
  return (
    <>
      <CheckoutData />
    </>
  );
};

export default CheckoutPage;
