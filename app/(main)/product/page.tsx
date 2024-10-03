'use client';
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProductCard } from './_components/ProductCard';
import SkeletonCard from './_components/SkeletonCard';
import { SearchFilters } from './_components/SearchFilter';
import ProductFilter from './_components/NavFilter';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import NewPagination from '@/app/admin/warehouse/components/WarehouseTable/DataTable/components/Pagination'

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


const BASE_URL = 'http://localhost:8080/api';
const ALL_CATEGORIES = 'all';

export default function ProductSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const getParamValue = useCallback((key: string, defaultValue: string) => {
    return searchParams.get(key) || defaultValue;
  }, [searchParams]);

  // Mengatur state awal berdasarkan parameter URL
  const searchTerm = getParamValue("search", "");
  const category = getParamValue("category", ALL_CATEGORIES);
  const [currentPage, setCurrentPage] = useState(parseInt(getParamValue("page", "0")));
  const [pageSize, setPageSize] = useState(parseInt(getParamValue("size", "10")));
  const sortBy = getParamValue("sortBy", "related");
  const sortDirection = getParamValue("sortDirection", "asc");;

  // Fungsi fetch untuk produk
  const fetchProducts = async ({ queryKey }: { queryKey: readonly unknown[] }): Promise<ApiResponse> => {
    const [_, page, size, categories, sort, direction, search] = queryKey as [string, string, string, string[], string, string, string];
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', size);
    if (categories.length > 0) {
      params.set('categoryName', categories.join(','));
    }
    if (sort !== "related") {
      params.set('sortBy', sort);
      params.set('sortDirection', direction);
    }
    if (search) params.set('search', search);

    const response = await axios.get<ApiResponse>(`${BASE_URL}/product?${params.toString()}`);
    return response.data;
  };
  // Menambahkan useEffect untuk memuat ulang parameter saat komponen di-mount
  useEffect(() => {
    setSelectedCategories(category !== ALL_CATEGORIES ? category.split(',') : []);
    setCurrentPage(parseInt(getParamValue("page", "0")));
    setPageSize(parseInt(getParamValue("size", "10")));
  }, [searchParams]); // Menambahkan searchParams sebagai dependensi

  // Fetch produk menggunakan React Query
  const { data: products, isLoading, error } = useQuery<ApiResponse, Error, ApiResponse, readonly [string, string, string, string[], string, string, string]>({
    queryKey: ['products', currentPage.toString(), pageSize.toString(), selectedCategories, sortBy, sortDirection, searchTerm] as const,
    queryFn: fetchProducts,
    staleTime: 5000,
  });


  const handleCategoryChange = (newCategories: string[]) => {
    setSelectedCategories(newCategories);
    updateSearchParams({ category: newCategories.join(',') });
  };
  useEffect(() => {
    const categoriesFromUrl = getParamValue("category", "").split(',').filter(Boolean);
    if (categoriesFromUrl.length > 0) {
      setSelectedCategories(categoriesFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    axios.get<Category[]>(`${BASE_URL}/category`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => console.error("Failed to fetch categories:", error));
  }, []);

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
    if (products && currentPage + 1 < products.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['products', (currentPage + 1).toString(), pageSize.toString(), selectedCategories, sortBy, sortDirection, searchTerm] as const,
        queryFn: fetchProducts,
      });
    }
  }, [products, currentPage, pageSize, selectedCategories, sortBy, sortDirection, searchTerm, queryClient]);

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
