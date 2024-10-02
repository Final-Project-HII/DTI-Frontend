import React from "react";
import Image from "next/image";
import LoadingImage from "@/public/loading.png";

const CategoryItemSkeleton: React.FC = () => (
    <div className="flex flex-col items-center px-0 mx-0 animate-pulse">
        <div className="bg-gray-200 p-1 sm:p-2 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg shadow-sm flex justify-center items-center">
            <Image
                src={LoadingImage}
                width={500}
                height={500}
                alt="Loading"
                className="w-8 h-8 sm:w-12 sm:h-10 lg:w-14 lg:h-14 object-contain opacity-50"
            />
        </div>
        <div className="bg-gray-200 h-3 w-12 sm:w-14 lg:w-16 rounded mt-1"></div>
    </div>
);

export default CategoryItemSkeleton;
