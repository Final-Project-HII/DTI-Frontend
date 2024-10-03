import React from "react";
import Image from "next/image";
import LoadingImage from "@/public/loading.png";
import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton: React.FC = () => {
    return (
        <div className="px-5 py-2 rounded-xl lg:px-16">
            <div className="bg-white rounded-xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-lg text-skeletonGray">...Loading Products</h1>
                </div>
                <div className="grid grid-cols-2 lg:gap-6 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {/* Statik map untuk 6 skeleton loader */}
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="overflow-hidden bg-white rounded-lg shadow-sm">
                            <div className="relative h-48 w-full gradient-background rounded-lg overflow-hidden">
                                <Image
                                    src={LoadingImage}
                                    alt="Loading placeholder"
                                    fill
                                    className="rounded-lg object-cover image"
                                />
                            </div>
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-8 w-full mt-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
