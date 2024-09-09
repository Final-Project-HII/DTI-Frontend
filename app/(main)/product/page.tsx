
'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import ProductFilter from './_components/NavFilter';
import { Pagination } from './_components/Pagination';
import { ProductCard } from './_components/ProductCard';
import { SearchFilters } from './_components/SearchFilter';
import { SkeletonCard } from './_components/SkeletonCard';

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

interface ApiResponse {
    content: Product[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    last: boolean;
    numberOfElements: number;
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    empty: boolean;
}
interface Category {
    id: number;
    name: string;
}

const BASE_URL = 'http://localhost:8080';
const ALL_CATEGORIES = 'all';

export default function ProductSearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const [categories, setCategories] = useState<Category[]>([]);

    const getParamValue = useCallback((key: string, defaultValue: string) => {
        return searchParams.get(key) || defaultValue;
    }, [searchParams]);

    const searchTerm = getParamValue("search", "");
    const categoryName = getParamValue("categoryName", ALL_CATEGORIES);
    const currentPage = parseInt(getParamValue("page", "0"));
    const pageSize = parseInt(getParamValue("size", "10"));
    const sortBy = getParamValue("sortBy", "related");
    const sortDirection = getParamValue("sortDirection", "asc");

    const fetchProducts = async ({ queryKey }: { queryKey: readonly unknown[] }): Promise<ApiResponse> => {
        const [_, page, size, category, sort, direction, search] = queryKey as [string, string, string, string, string, string, string];
        const params = new URLSearchParams();
        params.set('page', page);
        params.set('size', size);
        if (category !== ALL_CATEGORIES) params.set('categoryName', category);
        if (sort !== "related") {
            params.set('sortBy', sort);
            params.set('sortDirection', direction);
        }
        if (search) params.set('search', search);

        const response = await axios.get<ApiResponse>(`${BASE_URL}/product?${params.toString()}`);
        return response.data;
    };

    const { data, isLoading, error } = useQuery<ApiResponse, Error, ApiResponse, readonly [string, string, string, string, string, string, string]>({
        queryKey: ['products', currentPage.toString(), pageSize.toString(), categoryName, sortBy, sortDirection, searchTerm] as const,
        queryFn: fetchProducts,
        staleTime: 60000, // 1 minute
    });

    useEffect(() => {
        // Fetch categories
        axios.get<Category[]>(`${BASE_URL}/category`)
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => console.error("Failed to fetch categories:", error));
    }, []);

    const updateSearchParams = useDebouncedCallback((updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === ALL_CATEGORIES || value === 'related') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        if (updates.page === undefined) params.set('page', '0');
        router.push(`?${params.toString()}`, { scroll: false });
    }, 1000);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        updateSearchParams({ search: value });
    };

    const handleCategoryChange = (newCategory: string) => updateSearchParams({ categoryName: newCategory });
    const handleSortChange = (newSortBy: string) => {
        if (newSortBy === "related") {
            updateSearchParams({ sortBy: newSortBy, sortDirection: undefined });
        } else {
            updateSearchParams({ sortBy: newSortBy });
        }
    };

    const handleSortDirectionChange = (newDirection: string) => updateSearchParams({ sortDirection: newDirection });
    const handlePageChange = (newPage: number) => updateSearchParams({ page: newPage.toString() });

    useEffect(() => {
        // Prefetch next page
        if (data && currentPage + 1 < data.totalPages) {
            queryClient.prefetchQuery({
                queryKey: ['products', (currentPage + 1).toString(), pageSize.toString(), categoryName, sortBy, sortDirection, searchTerm] as const,
                queryFn: fetchProducts,
            });
        }
    }, [data, currentPage, pageSize, categoryName, sortBy, sortDirection, searchTerm, queryClient]);

    return (
        <div className="w-full mx-auto p-4 mt-16 lg:p-16">
            <div className="flex flex-col md:flex-row gap-4">
                <aside className="w-full md:w-1/4 p-4">
                    <ProductFilter
                        categoryName={categoryName}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        categories={categories}
                        onCategoryChange={handleCategoryChange}
                        onSortChange={handleSortChange}
                        onSortDirectionChange={handleSortDirectionChange}
                    />
                </aside>
                <div className='w-full bg-white p-8 rounded-lg'>
                    <h1 className="text-3xl font-bold mb-6">Product Search</h1>
                    <SearchFilters
                        searchTerm={searchTerm}
                        categoryName={categoryName}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        categories={categories}
                        onSearchChange={handleSearch}
                        onCategoryChange={handleCategoryChange}
                        onSortChange={handleSortChange}
                        onSortDirectionChange={handleSortDirectionChange}
                    />

                    {error instanceof Error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}

                    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 ">
                        {isLoading
                            ? Array.from({ length: pageSize }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                            : data?.content.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                    </div>

                    {data && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={data.totalPages}
                            totalElements={data.totalElements}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>

            </div>
        </div>
    );
}
