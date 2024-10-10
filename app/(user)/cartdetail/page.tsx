import React from 'react'
import CartPage from './_components/CartDetail'
import { Metadata } from 'next';
import { metadata as rootMetadata } from '@/app/layout';

const keywords = Array.isArray(rootMetadata.keywords) ? rootMetadata.keywords : [];
export const metadata: Metadata = {
  ...rootMetadata,
  title: "Your Cart - Hiimart Store",
  description: "View and manage your cart at Hiimart Store to enjoy fast shopping, track your orders, and discover exclusive deals tailored for you.",
  keywords: [...keywords, 'cart', 'shopping', 'Hiimart Store', 'online shopping'],
  openGraph: {
    ...rootMetadata.openGraph,
    title: "Your Cart - Hiimart Store",
    description: "Manage your cart at Hiimart Store to enjoy fast shopping, track your orders, and discover exclusive deals tailored for you.",
    url: '/cart',
  },
};

const page = () => {
  return (
    <div>
      <CartPage />
    </div>
  )
}

export default page
