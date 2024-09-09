import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageWithLoadingProps {
    src: string;
    alt: string;
    layout: "fixed" | "fill" | "responsive" | "intrinsic";
    objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
    className?: string;
    onClick?: () => void;
}

export const ImageWithLoading: React.FC<ImageWithLoadingProps> = ({ src, alt, layout, objectFit, className, onClick }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative w-full h-full">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                layout={layout}
                objectFit={objectFit}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                onLoadingComplete={() => setIsLoading(false)}
                onClick={onClick}
            />
        </div>
    );
};