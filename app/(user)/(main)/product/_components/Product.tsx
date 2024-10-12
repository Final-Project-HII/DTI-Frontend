'use client';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProductCard } from './ProductCard';
import SkeletonCard from './SkeletonCard';
import { SearchFilters } from './SearchFilter';
import ProductFilter from './NavFilter';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import NewPagination from '@/app/admin/warehouse/components/WarehouseTable/DataTable/components/Pagination'
import { useProductSearch } from '@/hooks/useProductSearch';

export default function ProductSearchPageClient() {
    const {
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
    } = useProductSearch();

    const sortedProducts = products?.content.sort((a, b) => (a.totalStock === 0 ? 1 : -1));

    return (
        <div className="w-full mx-auto px-0 md:px-4 p-4 mt-16 lg:px-16 lg:py-8 pt-14">
            <Breadcrumb className='lg:px-4 px-4 mb-4'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/product">Products</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {selectedCategories.length > 0 && (
                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedCategories.join(', ')}</BreadcrumbPage>
                        </BreadcrumbItem>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-col md:flex-row gap-0 lg:gap-4">
                <ProductFilter
                    selectedCategories={selectedCategories}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    categories={categories}
                    onCategoryChange={handleCategoryChange}
                    onSortChange={handleSortChange}
                />
                <div className='w-full bg-white p-4 lg:p-8 rounded-lg flex flex-col justify-between min-h-[calc(100vh-200px)]'>
                    <div className="w-full">
                        <SearchFilters
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            onSortChange={handleSortChange}
                        />

                        {error instanceof Error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error.message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-5">
                            {isLoading
                                ? Array.from({ length: pageSize }).map((_, index) => (
                                    <SkeletonCard key={index} />
                                ))
                                : sortedProducts?.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                        </div>
                    </div>

                    {products && (
                        <div className="mt-8">
                            <NewPagination
                                currentPage={currentPage}
                                totalPages={products.totalPages}
                                pageSize={pageSize}
                                totalElements={products.totalElements}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}