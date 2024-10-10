import { Metadata } from 'next';
import ProductPageClient from './ProductDetailClient';
import { getProductData } from '@/utils/product';
import { ProductDataResponse } from '@/types/product';
import { metadata as rootMetadata } from '@/app/layout';

interface ProductPageProps {
  params: { productDetail: string };
}

const keywords: string[] = Array.isArray(rootMetadata.keywords) ? rootMetadata.keywords : [];

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product: ProductDataResponse = await getProductData(params.productDetail);

    return {
      title: `${product.name} | Hiimart Store - Your Trusted Source for Fast & Easy Online Shopping`,
      description: product.description,
      keywords: [...keywords, product.name, 'product details'],
      openGraph: {
        title: `${product.name} | Hiimart Store`,
        description: product.description,
        url: `/product/${params.productDetail}`,
        images: product.productImages?.map(image => ({
          url: image.imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        })),
        type: 'website',
      },
    };
  } catch (error) {
    console.error('Error fetching product for metadata:', error);

    return {
      title: rootMetadata.title || 'Product Not Found',
      description: 'The product you are looking for does not exist or an error occurred.',
      keywords: rootMetadata.keywords || [],
      openGraph: {
        title: 'Product Not Found',
        description: 'The product you are looking for is not available.',
        url: `/product/${params.productDetail}`,
        images: rootMetadata.openGraph?.images || [],
        type: 'website',
      },
    };
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductPageClient params={{ productDetail: params.productDetail }} />;
}
