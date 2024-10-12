import React from 'react';
import Image from 'next/image';
import LoadingImage from "@/public/loading.png";

const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-white shadow-sm rounded-lg animate-pulse">
            <div className="relative h-48 bg-skeletonGray rounded-t-lg">
                <Image
                    src={LoadingImage}
                    alt="Loading placeholder"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-30"
                />
            </div>
            <div className="flex-grow flex flex-col p-4">
                <div className="h-6 bg-skeletonGray rounded mb-2"></div>
                <div className="h-4 bg-skeletonGray rounded mb-1"></div>
                <div className="h-4 bg-skeletonGray rounded mb-1"></div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
