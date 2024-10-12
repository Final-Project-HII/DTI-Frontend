import React from 'react';
import Link from 'next/link';
import Image from "next/image";

interface Category {
    id: number;
    name: string;
    categoryImage: string;
}

const CategoryItem: React.FC<{ category: Category }> = ({ category }) => (
    <div className="flex flex-col items-center px-0 mx-0">
        <Link href={`/product?page=0&category=${category.name}`}>
            <div className="bg-white p-1 sm:p-2 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg shadow-sm flex justify-center items-center">
                <Image
                    src={category.categoryImage ? category.categoryImage.startsWith('http') ? category.categoryImage : `https://res.cloudinary.com/dcjjcs49e/image/upload/${category.categoryImage}` : "/food.png"}
                    width={500}
                    height={500}
                    alt={category.name}
                    className="w-8 h-8 sm:w-12 sm:h-10 lg:w-14 lg:h-14 object-contain"
                />
            </div>
        </Link>
        <h2 className="text-center text-[10px] sm:text-xs lg:text-sm mt-1">{category.name}</h2>
    </div>
);

export default CategoryItem;