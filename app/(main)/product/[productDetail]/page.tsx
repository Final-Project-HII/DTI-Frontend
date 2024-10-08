import { Metadata } from 'next';
import ProductPageClient from './ProductDetailClient';
import { getProductData } from '@/utils/product';
import { ProductDataResponse } from '@/types/product';

interface ProductPageProps {
  params: { productDetail: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product: ProductDataResponse = await getProductData(params.productDetail);
    return {
      title: `${product.name} | Hiimart Store - Your Trusted Source for Fast & Easy Online Shopping`,
      description: product.description,
    };
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
    return {
      title: 'Product Details',
      description: 'View our product details',
    };
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductPageClient params={{ productDetail: params.productDetail }} />;
}