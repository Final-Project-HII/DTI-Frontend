'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pagination } from '@/app/(main)/product/_components/Pagination';
import { FaSearch } from 'react-icons/fa';
import { ProductTable } from './_components/StockTable';
import AddStockModal from './_components/AddStockModal';
import UpdateStockModal from './_components/UpdateStockModal';
// import ProductStockManagement from './_components/ProductStockManagement';

interface Warehouse {
    id: number;
    name: string;
}

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
    totalStock: number;
    productImages: ProductImage[];
    stocks: Stocks[];
    createdAt: string;
    updatedAt: string;
}

interface Stocks {
    id: number;
    warehouseId: number;
    warehouseName: string;
    quantity: number;
}

interface Stock {
    id: number;
    productId: number;
    warehouseId: number;
    quantity: number;
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

const BASE_URL = 'http://localhost:8080';

export default function StockManagementPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

    const getParamValue = useCallback((key: string, defaultValue: string) => {
        return searchParams.get(key) || defaultValue;
    }, [searchParams]);

    const searchTerm = getParamValue("search", "");
    const currentPage = parseInt(getParamValue("page", "0"));
    const pageSize = parseInt(getParamValue("size", "5"));
    const sortBy = getParamValue("sortBy", "name");
    const sortDirection = getParamValue("sortDirection", "asc");

    const fetchProducts = async ({ queryKey }: { queryKey: readonly unknown[] }): Promise<ApiResponse> => {
        const [_, page, size, sort, direction, search] = queryKey as [string, string, string, string, string, string];
        const params = new URLSearchParams();
        params.set('page', page);
        params.set('size', size);
        params.set('sortBy', sort);
        params.set('sortDirection', direction);
        if (search) params.set('search', search);

        const response = await axios.get<ApiResponse>(`${BASE_URL}/api/product?${params.toString()}`);
        return response.data;
    };

    const { data, isPending, error } = useQuery<ApiResponse, Error, ApiResponse, readonly [string, string, string, string, string, string]>({
        queryKey: ['products', currentPage.toString(), pageSize.toString(), sortBy, sortDirection, searchTerm] as const,
        queryFn: fetchProducts,
        staleTime: 60000, // 1 minute
    });

    useEffect(() => {
        // Fetch warehouses
        axios.get<{ data: Warehouse[] }>(`${BASE_URL}/api/warehouses`)
            .then(response => {
                setWarehouses(response.data.data);
            })
            .catch(error => console.error("Failed to fetch warehouses:", error));
    }, []);

    const updateSearchParams = useDebouncedCallback((updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        if (updates.page === undefined) params.set('page', '0');
        router.push(`?${params.toString()}`, { scroll: false });
    }, 300);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        updateSearchParams({ search: value });
    };

    const handleSortChange = (newSortBy: string) => updateSearchParams({ sortBy: newSortBy });
    const handleSortDirectionChange = (newDirection: string) => updateSearchParams({ sortDirection: newDirection });
    const handlePageChange = (newPage: number) => updateSearchParams({ page: newPage.toString() });

    const openAddModal = (product: Product) => {
        setSelectedProduct(product);
        setIsAddModalOpen(true);
    };

    const openUpdateModal = (stock: Stock) => {
        setSelectedStock(stock);
        setIsUpdateModalOpen(true);
    };

    return (
        <div className="container mx-auto p-4 lg:pt-14">
            {/* <ProductStockManagement /> */}
            <div className="flex gap-4 mb-6 justify-between flex-wrap w-auto">
                <div className='flex gap-2 justify-start w-auto'>
                    <h1 className="text-2xl font-bold flex w-full">Stock Management</h1>
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
                    <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                            <SelectItem value="name">Name</SelectItem>
                            {/* <SelectItem value="totalStock">Total Stock</SelectItem> */}
                            <SelectItem value="price">Price</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortDirection} onValueChange={handleSortDirectionChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort Direction" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                    </Select>
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
                onAddStock={openAddModal}
                onUpdateStock={openUpdateModal}
                isLoading={isPending}
            />

            {data && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={data.totalPages}
                    totalElements={data.totalElements}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
            )}

            <AddStockModal
                products={data?.content || []}
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                warehouses={warehouses}
                productId={selectedProduct?.id || 0}
            />

            <UpdateStockModal
                products={data?.content || []}
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                warehouses={warehouses}
                stock={selectedStock}
            />
        </div>
    );
}