import Image from 'next/image';

interface ProductImage {
    id: number;
    imageUrl: string;
}

interface ProductImageGalleryProps {
    images: ProductImage[];
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {images.map((image) => (
                <div key={image.id} className="relative w-20 h-20">
                    <Image
                        src={image.imageUrl}
                        alt="Product image"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                    />
                </div>
            ))}
        </div>
    );
};