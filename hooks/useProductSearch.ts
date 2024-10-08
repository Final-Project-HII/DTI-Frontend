import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchProducts, fetchCategories } from '../utils/product';
import { Category } from '@/types/product';

const ALL_CATEGORIES = 'all';

export const useProductSearch = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const getParamValue = useCallback((key: string, defaultValue: string) => {
        return searchParams.get(key) || defaultValue;
    }, [searchParams]);

    const searchTerm = getParamValue("search", "");
    const category = getParamValue("category", ALL_CATEGORIES);
    const [currentPage, setCurrentPage] = useState(parseInt(getParamValue("page", "0")));
    const [pageSize, setPageSize] = useState(parseInt(getParamValue("size", "10")));
    const sortBy = getParamValue("sortBy", "related");
    const sortDirection = getParamValue("sortDirection", "asc");

    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products', currentPage.toString(), pageSize.toString(), selectedCategories, sortBy, sortDirection, searchTerm] as const,
        queryFn: () => fetchProducts(currentPage.toString(), pageSize.toString(), selectedCategories, sortBy, sortDirection, searchTerm),
        staleTime: 5000,
    });

    const updateSearchParams = useDebouncedCallback((updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === '' || value === 'related') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        if (updates.page === undefined) params.set('page', '0');
        router.push(`?${params.toString()}`, { scroll: false });
    }, 300);

    const handleCategoryChange = (newCategories: string[]) => {
        setSelectedCategories(newCategories);
        updateSearchParams({ category: newCategories.join(',') });
    };

    const handleSortChange = (newSortBy: string, newSortDirection: string) => {
        if (newSortBy === "related") {
            updateSearchParams({ sortBy: newSortBy, sortDirection: undefined });
        } else {
            updateSearchParams({ sortBy: newSortBy, sortDirection: newSortDirection });
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        updateSearchParams({ page: newPage.toString() });
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        updateSearchParams({ size: newSize.toString(), page: "0" });
    };

    useEffect(() => {
        const categoriesFromUrl = getParamValue("category", "").split(',').filter(Boolean);
        if (categoriesFromUrl.length > 0) {
            setSelectedCategories(categoriesFromUrl);
        }
    }, [searchParams, getParamValue]);

    useEffect(() => {
        fetchCategories().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        if (products && currentPage + 1 < products.totalPages) {
            queryClient.prefetchQuery({
                queryKey: ['products', (currentPage + 1).toString(), pageSize.toString(), selectedCategories, sortBy, sortDirection, searchTerm] as const,
                queryFn: () => fetchProducts((currentPage + 1).toString(), pageSize.toString(), selectedCategories, sortBy, sortDirection, searchTerm),
            });
        }
    }, [products, currentPage, pageSize, selectedCategories, sortBy, sortDirection, searchTerm, queryClient]);

    return {
        products,
        isLoading,
        error,
        categories,
        selectedCategories,
        currentPage,
        pageSize,
        sortBy,
        sortDirection,
        handleCategoryChange,
        handleSortChange,
        handlePageChange,
        handlePageSizeChange,
    };
};