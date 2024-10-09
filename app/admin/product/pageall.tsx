// 'use client';

// import React, { useState, useCallback, useEffect, useMemo } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
// import axios from 'axios';
// import { useDebouncedCallback } from 'use-debounce';
// import {
//     useReactTable,
//     getCoreRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     SortingState,
//     ColumnDef
// } from "@tanstack/react-table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { AlertCircle, MoreVertical, Trash2, Edit } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import AddProductModal from './_components/AddProductModal';
// import EditProductModal from './_components/EditProductModal';
// import { Pagination } from '@/app/(user)/(main)/product/_components/Pagination';
// import { FaSearch } from 'react-icons/fa';
// import Image from 'next/image';

// interface ProductImage {
//     id: number;
//     productId: number;
//     imageUrl: string;
//     createdAt: string;
//     updatedAt: string;
// }

// interface Category {
//     id: number;
//     name: string;
// }

// interface Product {
//     id: number;
//     name: string;
//     description: string;
//     price: number;
//     weight: number;
//     categoryId: number;
//     categoryName: string;
//     totalStock: number;
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

// const BASE_URL = 'http://localhost:8080';
// const ALL_CATEGORIES = 'all';

// export default function ProductSearchPage() {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const queryClient = useQueryClient();
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
//     const [newCategoryName, setNewCategoryName] = useState('');
//     const [addingCategoryFor, setAddingCategoryFor] = useState<'new' | 'edit' | null>(null);

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

//     const { data, isPending, error } = useQuery<ApiResponse, Error, ApiResponse, readonly [string, string, string, string, string, string, string]>({
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

//     const handleCategoryFilterChange = (newCategory: string) => updateSearchParams({ categoryName: newCategory });
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

//     const deleteProductMutation = useMutation({
//         mutationFn: async (id: number) => {
//             await axios.delete(`${BASE_URL}/product/delete/${id}`);
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['products'] });
//         },
//     });

//     const handleDelete = (id: number) => {
//         if (window.confirm('Are you sure you want to delete this product?')) {
//             deleteProductMutation.mutate(id);
//         }
//     };

//     const openEditModal = (product: Product) => {
//         setEditingProduct(product);
//         setIsEditModalOpen(true);
//     };

//     const createCategoryMutation = useMutation({
//         mutationFn: async (name: string) => {
//             const response = await axios.post(`${BASE_URL}/category/create`, { name });
//             return response.data;
//         },
//         onSuccess: (newCategory) => {
//             queryClient.invalidateQueries({ queryKey: ['categories'] });
//             setCategories(prev => [...prev, newCategory]);
//             setIsAddCategoryModalOpen(false);
//             setNewCategoryName('');
//             setAddingCategoryFor(null);
//         },
//         onError: (error) => {
//             console.error('Failed to create category:', error);
//         }
//     });

//     const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         createCategoryMutation.mutate(newCategoryName);
//     };

//     const openAddCategoryModal = (type: 'new' | 'edit') => {
//         setAddingCategoryFor(type);
//         setIsAddCategoryModalOpen(true);
//     };


//     return (
//         <div className="container mx-auto p-4 lg:pt-14">

//             <div className="flex gap-4 mb-6 justify-between flex-wrap w-auto">
//                 <div className='flex gap-2 justify-start w-auto'>
//                     <h1 className="text-2xl font-bold flex w-full">Product List</h1>

//                 </div>
//                 <div className='flex gap-2 justify-end w-auto'>
//                     <div className="flex relative w-full">
//                         <Input
//                             placeholder="Search products..."
//                             defaultValue={searchTerm}
//                             onChange={handleSearch}
//                             className="w-full pl-10"
//                         />
//                         <FaSearch className='size-4 absolute left-4 top-0 translate-y-3 text-gray-400' />
//                     </div>
//                     <Select value={categoryName} onValueChange={handleCategoryFilterChange}>
//                         <SelectTrigger className="w-[180px]">
//                             <SelectValue placeholder="All Categories" />
//                         </SelectTrigger>
//                         <SelectContent className='bg-white'>
//                             <SelectItem value={ALL_CATEGORIES} className='hover:bg-gray-200'>All Categories</SelectItem>
//                             {categories.map((category) => (
//                                 <SelectItem key={category.id} value={category.name} className='hover:bg-gray-200'>
//                                     {category.name}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>

//                     <Select value={sortBy} onValueChange={handleSortChange}>
//                         <SelectTrigger className="w-[180px]">
//                             <SelectValue placeholder="Sort By" />
//                         </SelectTrigger>
//                         <SelectContent className='bg-white'>
//                             <SelectItem value="related">Related</SelectItem>
//                             <SelectItem value="price">Price</SelectItem>
//                             <SelectItem value="name">Name</SelectItem>
//                             <SelectItem value="createdAt">Date Added</SelectItem>
//                         </SelectContent>
//                     </Select>
//                     {sortBy !== "related" && (
//                         <Select value={sortDirection} onValueChange={handleSortDirectionChange}>
//                             <SelectTrigger className="w-[180px]">
//                                 <SelectValue placeholder="Sort Direction" />
//                             </SelectTrigger>
//                             <SelectContent className='bg-white'>
//                                 <SelectItem value="asc">Ascending</SelectItem>
//                                 <SelectItem value="desc">Descending</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     )}
//                     <Button onClick={() => setIsAddModalOpen(true)} className="mb-4 bg-blue-600 text-white">
//                         + Add Product
//                     </Button>
//                 </div>
//             </div>

//             {error instanceof Error && (
//                 <Alert variant="destructive" className="mb-6">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error.message}</AlertDescription>
//                 </Alert>
//             )}

//             <Table className=' p-4 '>
//                 <TableHeader>
//                     <TableRow className='bg-blue-600 hover:bg-transparent-none'>
//                         <TableHead className='text-white '>No</TableHead>
//                         <TableHead className='text-white'>Image</TableHead>
//                         <TableHead className='text-white'>Name</TableHead>
//                         <TableHead className='text-white'>Stock</TableHead>
//                         <TableHead className='text-white'>Ordered Qty</TableHead>
//                         <TableHead className='text-white'>Status</TableHead>
//                         <TableHead className='text-white'>Price</TableHead>
//                         <TableHead className='text-white'>Actions</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {isPending
//                         ? <TableRow><TableCell colSpan={8}><p>Loading...</p></TableCell></TableRow>
//                         : data?.content.map((product, index) => (
//                             <TableRow key={product.id}>
//                                 <TableCell>{currentPage * pageSize + index + 1}</TableCell>
//                                 <TableCell>
//                                     <div className="bg-white flex items-center justify-center p-1 w-14 h-14 rounded-xl shadow-md">
//                                         {product.productImages.length > 0 && (
//                                             <Image
//                                                 src={product.productImages[0].imageUrl}
//                                                 alt={product.name}
//                                                 className="w-12 h-12 object-contain rounded"
//                                                 width={48}
//                                                 height={48}
//                                             />
//                                         )}
//                                     </div>
//                                 </TableCell>
//                                 <TableCell>{product.name}</TableCell>
//                                 <TableCell>{product.totalStock}</TableCell>
//                                 <TableCell>20</TableCell>
//                                 <TableCell>
//                                     {product.totalStock > 0 ? (
//                                         <Badge className="bg-green-100 text-green-700"> • Available</Badge>
//                                     ) : (
//                                         <Badge className="bg-red-100 text-red-700"> • Out of Stock</Badge>
//                                     )}
//                                 </TableCell>
//                                 <TableCell>Rp {product.price.toLocaleString()}</TableCell>
//                                 <TableCell>
//                                     <DropdownMenu>
//                                         <DropdownMenuTrigger asChild>
//                                             <Button variant="ghost" className="h-8 w-8 p-0">
//                                                 <MoreVertical className="h-4 w-4" />
//                                             </Button>
//                                         </DropdownMenuTrigger>
//                                         <DropdownMenuContent align="end" className="bg-white">
//                                             <DropdownMenuItem onClick={() => openEditModal(product)}>
//                                                 <Edit className="mr-2 h-4 w-4" />
//                                                 <span>Edit</span>
//                                             </DropdownMenuItem>
//                                             <DropdownMenuItem onClick={() => handleDelete(product.id)}>
//                                                 <Trash2 className="mr-2 h-4 w-4" />
//                                                 <span>Delete</span>
//                                             </DropdownMenuItem>
//                                         </DropdownMenuContent>
//                                     </DropdownMenu>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                 </TableBody>
//             </Table>

//             {/* Pagination */}
//             {data && (
//                 <Pagination
//                     currentPage={currentPage}
//                     totalPages={data.totalPages}
//                     totalElements={data.totalElements}
//                     pageSize={pageSize}
//                     onPageChange={handlePageChange}
//                 />
//             )}

//             {/* Add Product Modal */}
//             <AddProductModal
//                 isOpen={isAddModalOpen}
//                 onClose={() => setIsAddModalOpen(false)}
//                 categories={categories}
//                 openAddCategoryModal={openAddCategoryModal}
//             />

//             {/* Edit Product Modal */}
//             <EditProductModal
//                 isOpen={isEditModalOpen}
//                 onClose={() => setIsEditModalOpen(false)}
//                 product={editingProduct}
//                 categories={categories}
//                 openAddCategoryModal={openAddCategoryModal}

//             />

//             {deleteProductMutation.isError && (
//                 <Alert variant="destructive" className="mt-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{(deleteProductMutation.error as Error).message}</AlertDescription>
//                 </Alert>
//             )}
//         </div>
//     );
// }