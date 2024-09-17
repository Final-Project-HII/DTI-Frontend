'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AddProductModal from './_components/AddProductModal';
import EditProductModal from './_components/EditProductModal';
import { Pagination } from '@/app/(main)/product/_components/Pagination';
import { FaSearch } from 'react-icons/fa';
import { ProductTable } from './_components/ProductTable';

interface ProductImage {
    id: number;
    productId: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    weight: number;
    categoryId: number;
    categoryName: string;
    totalStock: number;
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

const BASE_URL = 'http://localhost:8080/api';
const ALL_CATEGORIES = 'all';

export default function ProductSearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [addingCategoryFor, setAddingCategoryFor] = useState<'new' | 'edit' | null>(null);

    const getParamValue = useCallback((key: string, defaultValue: string) => {
        return searchParams.get(key) || defaultValue;
    }, [searchParams]);

    const searchTerm = getParamValue("search", "");
    const categoryName = getParamValue("categoryName", ALL_CATEGORIES);
    const currentPage = parseInt(getParamValue("page", "0"));
    const pageSize = parseInt(getParamValue("size", "8"));
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

    const { data, isPending, error } = useQuery<ApiResponse, Error, ApiResponse, readonly [string, string, string, string, string, string, string]>({
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

    const handleCategoryFilterChange = (newCategory: string) => updateSearchParams({ categoryName: newCategory });
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

    const deleteProductMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`${BASE_URL}/product/delete/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProductMutation.mutate(id);
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsEditModalOpen(true);
    };

    const createCategoryMutation = useMutation({
        mutationFn: async (name: string) => {
            const response = await axios.post(`${BASE_URL}/category/create`, { name });
            return response.data;
        },
        onSuccess: (newCategory) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setCategories(prev => [...prev, newCategory]);
            setIsAddCategoryModalOpen(false);
            setNewCategoryName('');
            setAddingCategoryFor(null);
        },
        onError: (error) => {
            console.error('Failed to create category:', error);
        }
    });

    const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createCategoryMutation.mutate(newCategoryName);
    };

    const openAddCategoryModal = (type: 'new' | 'edit') => {
        setAddingCategoryFor(type);
        setIsAddCategoryModalOpen(true);
    };


    return (
        <div className="container mx-auto p-4 lg:pt-14">

            <div className="flex gap-4 mb-6 justify-between flex-wrap w-auto">
                <div className='flex gap-2 justify-start w-auto'>
                    <h1 className="text-2xl font-bold flex w-full">Product List</h1>

                </div>
                <div className='flex gap-2 justify-end w-auto'>
                    <div className="flex relative w-full">
                        <Input
                            placeholder="Search products..."
                            defaultValue={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10"
                        />
                        <FaSearch className='size-4 absolute left-4 top-0 translate-y-3 text-gray-400' />
                    </div>
                    <Select value={categoryName} onValueChange={handleCategoryFilterChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                            <SelectItem value={ALL_CATEGORIES} className='hover:bg-gray-200'>All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.name} className='hover:bg-gray-200'>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                            <SelectItem value="related">Related</SelectItem>
                            <SelectItem value="price">Price</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="createdAt">Date Added</SelectItem>
                        </SelectContent>
                    </Select>
                    {sortBy !== "related" && (
                        <Select value={sortDirection} onValueChange={handleSortDirectionChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort Direction" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                    <Button onClick={() => setIsAddModalOpen(true)} className="mb-4 bg-blue-600 text-white">
                        + Add Product
                    </Button>
                </div>
            </div>

            {error instanceof Error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}

            <ProductTable
                products={data?.content || []}
                currentPage={currentPage}
                pageSize={pageSize}
                onEdit={openEditModal}
                onDelete={handleDelete}
                isLoading={isPending}
            />

            {/* Pagination */}
            {data && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={data.totalPages}
                    totalElements={data.totalElements}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                categories={categories}
                openAddCategoryModal={openAddCategoryModal}
            />

            {/* Edit Product Modal */}
            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                product={editingProduct}
                categories={categories}
                openAddCategoryModal={openAddCategoryModal}
            />

            {deleteProductMutation.isError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{(deleteProductMutation.error as Error).message}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}