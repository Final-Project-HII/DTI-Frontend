import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';

interface ProductImage {
    id: number;
    productId: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    weight: number;
    categoryId: number;
    categoryName: string;
    productImages: ProductImage[];
    createdAt: string;
    updatedAt: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Card>
            <CardHeader className='relative p-0 mb-4'>
                <img
                    src={product.productImages[0]?.imageUrl || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-[200px] object-cover rounded-md"
                />
                <Badge className="absolute top-3 right-3 bg-white text-blue-600">
                    {product.categoryName}
                </Badge>
            </CardHeader>
            <CardContent>
                <CardTitle className="mb-2">{product.name}</CardTitle>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center mt-1">
                    <Badge variant="destructive" className="bg-red-100 text-orange-500 mr-2 rounded-sm">
                        50 %
                    </Badge>
                    <p className="text-xs text-gray-500 line-through mr-2">
                        Rp {product.price.toLocaleString()}
                    </p>
                </div>
                <p className="font-bold text-orange-500 my-2 text-base">Rp {product.price.toLocaleString()}</p>
                <p className="text-sm">Weight: {product.weight}g</p>
                <p className="text-sm">Category: {product.categoryName}</p>
            </CardContent>
            <CardFooter>
                <Button className="w-full border-2 border-blue-600 text-blue-600"> + Add to Cart</Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;


// 'use client';

// import { useState, useCallback, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import { useDebouncedCallback } from 'use-debounce';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Skeleton } from "@/components/ui/skeleton";
// import { AlertCircle } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Badge } from '@/components/ui/badge';

// interface ProductImage {
//     id: number;
//     productId: number;
//     imageUrl: string;
//     createdAt: string;
//     updatedAt: string;
// }

// interface Product {
//     id: number;
//     name: string;
//     description: string;
//     price: number;
//     weight: number;
//     categoryId: number;
//     categoryName: string;
//     productImages: ProductImage[];
//     createdAt: string;
//     updatedAt: string;
// }

// interface ApiResponse {
//     content: Product[];
//     totalPages: number;
//     totalElements: number;
//     size: number;
//     number: number;
//     sort: {
//         empty: boolean;
//         sorted: boolean;
//         unsorted: boolean;
//     };
//     first: boolean;
//     last: boolean;
//     numberOfElements: number;
//     pageable: {
//         pageNumber: number;
//         pageSize: number;
//         sort: {
//             empty: boolean;
//             sorted: boolean;
//             unsorted: boolean;
//         };
//         offset: number;
//         paged: boolean;
//         unpaged: boolean;
//     };
//     empty: boolean;
// }
// interface Category {
//     id: number;
//     name: string;
// }

// const BASE_URL = 'http://localhost:8080';
// const ALL_CATEGORIES = 'all';

// export default function ProductSearchPage() {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const queryClient = useQueryClient();
//     const [categories, setCategories] = useState<Category[]>([]);

//     const getParamValue = useCallback((key: string, defaultValue: string) => {
//         return searchParams.get(key) || defaultValue;
//     }, [searchParams]);

//     const searchTerm = getParamValue("search", "");
//     const categoryName = getParamValue("categoryName", ALL_CATEGORIES);
//     const currentPage = parseInt(getParamValue("page", "0"));
//     const pageSize = parseInt(getParamValue("size", "8"));
//     const sortBy = getParamValue("sortBy", "related");
//     const sortDirection = getParamValue("sortDirection", "asc");

//     const fetchProducts = async ({ queryKey }: { queryKey: readonly unknown[] }): Promise<ApiResponse> => {
//         const [_, page, size, category, sort, direction, search] = queryKey as [string, string, string, string, string, string, string];
//         const params = new URLSearchParams();
//         params.set('page', page);
//         params.set('size', size);
//         if (category !== ALL_CATEGORIES) params.set('categoryName', category);
//         if (sort !== "related") {
//             params.set('sortBy', sort);
//             params.set('sortDirection', direction);
//         }
//         if (search) params.set('search', search);

//         const response = await axios.get<ApiResponse>(`${BASE_URL}/product?${params.toString()}`);
//         return response.data;
//     };

//     const { data, isLoading, error } = useQuery<ApiResponse, Error, ApiResponse, readonly [string, string, string, string, string, string, string]>({
//         queryKey: ['products', currentPage.toString(), pageSize.toString(), categoryName, sortBy, sortDirection, searchTerm] as const,
//         queryFn: fetchProducts,
//         staleTime: 60000, // 1 minute
//     });

//     useEffect(() => {
//         // Fetch categories
//         axios.get<Category[]>(`${BASE_URL}/category`)
//             .then(response => {
//                 setCategories(response.data);
//             })
//             .catch(error => console.error("Failed to fetch categories:", error));
//     }, []);

//     const updateSearchParams = useDebouncedCallback((updates: Record<string, string | undefined>) => {
//         const params = new URLSearchParams(searchParams.toString());
//         Object.entries(updates).forEach(([key, value]) => {
//             if (value === undefined || value === ALL_CATEGORIES || value === 'related') {
//                 params.delete(key);
//             } else {
//                 params.set(key, value);
//             }
//         });
//         if (updates.page === undefined) params.set('page', '0');
//         router.push(`?${params.toString()}`, { scroll: false });
//     }, 1000);

//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         updateSearchParams({ search: value });
//     };

//     const handleCategoryChange = (newCategory: string) => updateSearchParams({ categoryName: newCategory });
//     const handleSortChange = (newSortBy: string) => {
//         if (newSortBy === "related") {
//             updateSearchParams({ sortBy: newSortBy, sortDirection: undefined });
//         } else {
//             updateSearchParams({ sortBy: newSortBy });
//         }
//     };

//     const handleSortDirectionChange = (newDirection: string) => updateSearchParams({ sortDirection: newDirection });
//     const handlePageChange = (newPage: number) => updateSearchParams({ page: newPage.toString() });

//     useEffect(() => {
//         // Prefetch next page
//         if (data && currentPage + 1 < data.totalPages) {
//             queryClient.prefetchQuery({
//                 queryKey: ['products', (currentPage + 1).toString(), pageSize.toString(), categoryName, sortBy, sortDirection, searchTerm] as const,
//                 queryFn: fetchProducts,
//             });
//         }
//     }, [data, currentPage, pageSize, categoryName, sortBy, sortDirection, searchTerm, queryClient]);


//     const SkeletonCard = () => (
//         <Card>
//             <CardHeader>
//                 <Skeleton className="h-[200px] w-full" />
//             </CardHeader>
//             <CardContent>
//                 <Skeleton className="h-6 w-3/4 mb-2" />
//                 <Skeleton className="h-4 w-full mb-2" />
//                 <Skeleton className="h-4 w-2/3 mb-2" />
//                 <Skeleton className="h-5 w-1/3 mb-2" />
//                 <Skeleton className="h-4 w-1/2 mb-2" />
//             </CardContent>
//             <CardFooter>
//                 <Skeleton className="h-10 w-full" />
//             </CardFooter>
//         </Card>
//     );

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-6">Product Search</h1>

//             <div className="flex flex-wrap gap-4 mb-6">
//                 <Input
//                     placeholder="Search products..."
//                     defaultValue={searchTerm}
//                     onChange={handleSearch}
//                     className="flex-grow"
//                 />
//                 <Select value={categoryName} onValueChange={handleCategoryChange}>
//                     <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="All Categories" />
//                     </SelectTrigger>
//                     <SelectContent className='bg-white'>
//                         <SelectItem value={ALL_CATEGORIES} className='hover:bg-gray-200'>All Categories</SelectItem>
//                         {categories.map((category) => (
//                             <SelectItem key={category.id} value={category.name} className='hover:bg-gray-200'>
//                                 {category.name}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>

//                 <Select value={sortBy} onValueChange={handleSortChange}>
//                     <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="Sort By" />
//                     </SelectTrigger>
//                     <SelectContent className='bg-white'>
//                         <SelectItem value="related">Related</SelectItem>
//                         <SelectItem value="price">Price</SelectItem>
//                         <SelectItem value="name">Name</SelectItem>
//                         <SelectItem value="createdAt">Date Added</SelectItem>
//                     </SelectContent>
//                 </Select>
//                 {sortBy !== "related" && (
//                     <Select value={sortDirection} onValueChange={handleSortDirectionChange}>
//                         <SelectTrigger className="w-[180px]">
//                             <SelectValue placeholder="Sort Direction" />
//                         </SelectTrigger>
//                         <SelectContent className='bg-white'>
//                             <SelectItem value="asc">Ascending</SelectItem>
//                             <SelectItem value="desc">Descending</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 )}
//             </div>

//             {error instanceof Error && (
//                 <Alert variant="destructive" className="mb-6">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error.message}</AlertDescription>
//                 </Alert>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {isLoading
//                     ? Array.from({ length: pageSize }).map((_, index) => (
//                         <SkeletonCard key={index} />
//                     ))
//                     : data?.content.map((product) => (
//                         <Card key={product.id}>
//                             <CardHeader className='relative p-0 mb-4'>
//                                 <img
//                                     src={product.productImages[0]?.imageUrl || '/placeholder.jpg'}
//                                     alt={product.name}
//                                     className="w-full h-[200px] object-cover rounded-md"
//                                 />
//                                 <Badge className="absolute top-3 right-3 bg-white text-blue-600">
//                                     {product.categoryName}
//                                 </Badge>
//                             </CardHeader>
//                             <CardContent>
//                                 <CardTitle className="mb-2">{product.name}</CardTitle>
//                                 <p className="text-sm text-gray-600 mb-2">{product.description}</p>
//                                 <div className="flex items-center mt-1">
//                                     <Badge variant="destructive" className="bg-red-100 text-orange-500 mr-2 rounded-sm">
//                                         50 %
//                                     </Badge>
//                                     <p className="text-xs text-gray-500 line-through mr-2">
//                                         Rp {product.price.toLocaleString()}
//                                     </p>
//                                 </div>
//                                 <p className="font-bold text-orange-500 my-2 text-base">Rp {product.price.toLocaleString()}</p>
//                                 <p className="text-sm">Weight: {product.weight}g</p>
//                                 <p className="text-sm">Category: {product.categoryName}</p>
//                             </CardContent>
//                             <CardFooter>
//                                 <Button className="w-full border-2 border-blue-600 text-blue-600"> + Add to Cart</Button>
//                             </CardFooter>
//                         </Card>
//                     ))}
//             </div>

//             {data && (
//                 <div className="mt-8 flex justify-center">
//                     <div className="flex items-center space-x-2">
//                         <Button
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             disabled={currentPage === 0}
//                             variant="outline"
//                         >
//                             Previous
//                         </Button>
//                         <span className="text-sm text-gray-600">
//                             Page {currentPage + 1} of {data.totalPages}
//                         </span>
//                         <Button
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             disabled={currentPage + 1 >= data.totalPages}
//                             variant="outline"
//                         >
//                             Next
//                         </Button>
//                     </div>
//                 </div>
//             )}
//             {data && (
//                 <p className="text-sm text-gray-600 mt-2 text-center">
//                     Showing {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, data.totalElements)} of {data.totalElements} products
//                 </p>
//             )}

//         </div>
//     );
// }



//sudah ada respoms global
// 'use client';
// import React from 'react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { AlertCircle } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import ProductGrid from '@/components/product/ProductGrid';
// import Pagination from '@/components/product/Pagination';
// import { useProductSearch } from '@/hooks/useProductSearch';


// const ALL_CATEGORIES = 'all';

// interface Category {
//     id: number;
//     name: string;
//     products: number[];
//     createdAt: string;
//     updatedAt: string;
// }


// export default function ProductSearchPage() {
//     const {
//         data,
//         isLoading,
//         error,
//         categoryName,
//         currentPage,
//         pageSize,
//         sortBy,
//         sortDirection,
//         handleCategoryChange,
//         handleSortChange,
//         handleSortDirectionChange,
//         handlePageChange,
//     } = useProductSearch();

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-6">Product Search</h1>

//             <div className="flex flex-wrap gap-4 mb-6">
//                 <Select value={categoryName} onValueChange={handleCategoryChange}>
//                     <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="All Categories" />
//                     </SelectTrigger>
//                     <SelectContent className='bg-white'>
//                         <SelectItem value={ALL_CATEGORIES} className='hover:bg-gray-200'>All Categories</SelectItem>
//                         {data?.categories.map((category) => (
//                             <SelectItem key={category.id} value={category.name} className='hover:bg-gray-200'>
//                                 {category.name}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>

//                 <Select value={sortBy} onValueChange={handleSortChange}>
//                     <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="Sort By" />
//                     </SelectTrigger>
//                     <SelectContent className='bg-white'>
//                         <SelectItem value="related">Related</SelectItem>
//                         <SelectItem value="price">Price</SelectItem>
//                         <SelectItem value="name">Name</SelectItem>
//                         <SelectItem value="createdAt">Date Added</SelectItem>
//                     </SelectContent>
//                 </Select>
//                 {sortBy !== "related" && (
//                     <Select value={sortDirection} onValueChange={handleSortDirectionChange}>
//                         <SelectTrigger className="w-[180px]">
//                             <SelectValue placeholder="Sort Direction" />
//                         </SelectTrigger>
//                         <SelectContent className='bg-white'>
//                             <SelectItem value="asc">Ascending</SelectItem>
//                             <SelectItem value="desc">Descending</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 )}
//             </div>

//             {error instanceof Error && (
//                 <Alert variant="destructive" className="mb-6">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error.message}</AlertDescription>
//                 </Alert>
//             )}

//             <ProductGrid isLoading={isLoading} data={data} pageSize={pageSize} />

//             {data && (
//                 <>
//                     <Pagination
//                         currentPage={currentPage}
//                         totalPages={data.totalPages}
//                         handlePageChange={handlePageChange}
//                     />
//                     <p className="text-sm text-gray-600 mt-2 text-center">
//                         Showing {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, data.totalElements)} of {data.totalElements} products
//                     </p>
//                 </>
//             )}
//         </div>
//     );
// }