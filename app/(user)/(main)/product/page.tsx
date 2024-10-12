import React from 'react'
import ProductSearchPageClient from './_components/Product'
import { metadata as baseMetadata } from "@/app/layout";

const keywords = Array.isArray(baseMetadata.keywords) ? baseMetadata.keywords : [];
export const metadata = {
  ...baseMetadata,
  title: "Search Products - Hiimart Store",
  description: "Find your desired products at Hiimart Store. Browse and shop from a wide range of items.",
  keywords: [...keywords, 'product search', 'browse products', 'Hiimart product search'],
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Search Results - Hiimart Store",
    description: "Browse through search results and find your perfect product at Hiimart Store.",
    url: '/product',
  },
};


const page = () => {
  return (
    <div>
      <ProductSearchPageClient />
    </div>
  )
}

export default page
