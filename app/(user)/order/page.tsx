import React from 'react'
import OrderList from './components/Order'
import { Metadata } from 'next';
import { metadata as rootMetadata } from '@/app/layout';

const keywords = Array.isArray(rootMetadata.keywords) ? rootMetadata.keywords : [];

export const metadata: Metadata = {
  ...rootMetadata,
  title: "Hiimart Store - Your Order List",
  description: "View and manage your orders at Hiimart Store. Track your purchases and order status easily.",
  keywords: [...keywords, 'order list', 'manage orders', 'Hiimart Store'],
  openGraph: {
    ...rootMetadata.openGraph,
    title: "Order List - Hiimart Store",
    description: "Manage your order list effectively at Hiimart Store.",
    url: '/orders',
  },
}

const page = () => {
  return (
    <div>
      <OrderList />
    </div>
  )
}

export default page
