// 'use client';

// import React, { useState, useCallback, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
// import axios from 'axios';
// import { useDebouncedCallback } from 'use-debounce';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { AlertCircle, X, MoreVertical, Trash2, Edit, Plus } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Textarea } from "@/components/ui/textarea";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import CategorySelect from './_components/CategorySelect';
// import AddProductModal from './_components/AddProductModal';
// import ProductTable from './_components/ProductTable';
// import { Pagination } from '@/app/(main)/product/_components/Pagination';


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
//     const [newProduct, setNewProduct] = useState({
//         name: '',
//         description: '',
//         price: '',
//         weight: '',
//         categoryId: '',
//     });
//     const [productImages, setProductImages] = useState<File[]>([]);
//     const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//     const [editProductImages, setEditProductImages] = useState<File[]>([]);
//     const [deleteImages, setDeleteImages] = useState<number[]>([]);
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

//     const createProductMutation = useMutation({
//         mutationFn: async (formData: FormData) => {
//             const response = await axios.post(`${BASE_URL}/product/create`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             return response.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['products'] });
//             // Reset form
//             setNewProduct({
//                 name: '',
//                 description: '',
//                 price: '',
//                 weight: '',
//                 categoryId: '',
//             });
//             setProductImages([]);
//         },
//     });

//     const updateProductMutation = useMutation({
//         mutationFn: async ({ id, formData }: { id: number, formData: FormData }) => {
//             const response = await axios.put(`${BASE_URL}/product/update/${id}`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             return response.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['products'] });
//             setIsEditModalOpen(false);
//             setEditingProduct(null);
//             setEditProductImages([]);
//             setDeleteImages([]);
//         },
//     });

//     const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!editingProduct) return;

//         const formData = new FormData();

//         // Create the product JSON
//         const productJson = {
//             name: editingProduct.name,
//             description: editingProduct.description,
//             price: editingProduct.price.toString(),
//             weight: editingProduct.weight,
//             categoryId: editingProduct.categoryId,
//             deleteImages: deleteImages
//         };

//         // Append the product JSON as a string
//         formData.append('product', JSON.stringify(productJson));

//         // Append each new image
//         editProductImages.forEach((image) => {
//             formData.append('newImages', image);
//         });

//         updateProductMutation.mutate({ id: editingProduct.id, formData });
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setNewProduct(prev => ({ ...prev, [name]: value }));
//     };

//     const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setEditingProduct(prev => prev ? { ...prev, [name]: value } : null);
//     };

//     const handleCategoryChange = (categoryId: string) => {
//         setNewProduct(prev => ({ ...prev, categoryId }));
//     };

//     const handleEditCategoryChange = (categoryId: string) => {
//         setEditingProduct(prev => prev ? { ...prev, categoryId: parseInt(categoryId) } : null);
//     };

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setProductImages(prev => [...prev, ...Array.from(e.target.files || [])]);
//         }
//     };

//     const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setEditProductImages(prev => [...prev, ...Array.from(e.target.files || [])]);
//         }
//     };

//     const handleRemoveImage = (index: number) => {
//         setProductImages(prev => prev.filter((_, i) => i !== index));
//     };

//     const handleRemoveEditImage = (index: number) => {
//         setEditProductImages(prev => prev.filter((_, i) => i !== index));
//     };

//     const handleRemoveExistingImage = (imageId: number) => {
//         setDeleteImages(prev => [...prev, imageId]);
//         setEditingProduct(prev =>
//             prev ? {
//                 ...prev,
//                 productImages: prev.productImages.filter(img => img.id !== imageId)
//             } : null
//         );
//     };

//     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const formData = new FormData();
//         Object.entries(newProduct).forEach(([key, value]) => {
//             formData.append(key, value);
//         });
//         productImages.forEach((image) => {
//             formData.append('productImages', image);
//         });
//         createProductMutation.mutate(formData);
//     };
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

//             // Update the product with the new category
//             if (addingCategoryFor === 'new') {
//                 setNewProduct(prev => ({ ...prev, categoryId: newCategory.id.toString() }));
//             } else if (addingCategoryFor === 'edit' && editingProduct) {
//                 setEditingProduct(prev => prev ? { ...prev, categoryId: newCategory.id } : null);
//             }

//             setAddingCategoryFor(null);
//         },
//         onError: (error) => {
//             console.error('Failed to create category:', error);
//             // Here you could set some state to show an error message to the user
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
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-6">Product List</h1>

//             <div className="flex flex-wrap gap-4 mb-6">
//                 {/* Add Product Button */}
//                 <div className='w-full flex justify-between gap-3'>
//                     <Input
//                         placeholder="Search products..."
//                         defaultValue={searchTerm}
//                         onChange={handleSearch}
//                         className="flex-grow"
//                     />
//                     <Button onClick={() => setIsAddModalOpen(true)} className="mb-4 bg-blue-600 text-white">
//                         + Add Product
//                     </Button>
//                 </div>

//                 <Select value={categoryName} onValueChange={handleCategoryFilterChange}>
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


//             {createProductMutation.isError && (
//                 <Alert variant="destructive" className="mt-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{(createProductMutation.error as Error).message}</AlertDescription>
//                 </Alert>
//             )}

//             <Table className='bg-white p-4 rounded-md'>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>No</TableHead>
//                         <TableHead>Image</TableHead>
//                         <TableHead>Name</TableHead>
//                         <TableHead>Stock</TableHead>
//                         <TableHead>Ordered Qty</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Price</TableHead>
//                         <TableHead>Actions</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {isPending
//                         ? <TableRow><TableCell colSpan={8}><p>Loading...</p></TableCell></TableRow>
//                         : data?.content.map((product, index) => (
//                             <TableRow key={product.id}>
//                                 <TableCell>{currentPage * pageSize + index + 1}</TableCell>
//                                 <TableCell>
//                                     {product.productImages.length > 0 && (
//                                         <img
//                                             src={product.productImages[0].imageUrl}
//                                             alt={product.name}
//                                             className="w-12 h-12 object-cover rounded"
//                                         />
//                                     )}
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
//             <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
//                 <DialogContent className="sm:max-w-[425px] bg-white">
//                     <DialogHeader>
//                         <DialogTitle>Add New Product</DialogTitle>
//                     </DialogHeader>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <Input
//                             name="name"
//                             value={newProduct.name}
//                             onChange={handleInputChange}
//                             placeholder="Product Name"
//                             required
//                         />
//                         <Textarea
//                             name="description"
//                             value={newProduct.description}
//                             onChange={handleInputChange}
//                             placeholder="Product Description"
//                             required
//                         />
//                         <Input
//                             name="price"
//                             type="number"
//                             value={newProduct.price}
//                             onChange={handleInputChange}
//                             placeholder="Price"
//                             required
//                         />
//                         <Input
//                             name="weight"
//                             type="number"
//                             value={newProduct.weight}
//                             onChange={handleInputChange}
//                             placeholder="Weight"
//                             required
//                         />

//                         <CategorySelect
//                             value={newProduct.categoryId}
//                             onChange={handleCategoryChange}
//                             openModalFn={() => openAddCategoryModal('new')}
//                             categories={categories}
//                         />
//                         <Input
//                             type="file"
//                             onChange={handleImageChange}
//                             multiple
//                             accept="image/*"
//                         />
//                         <div className="mt-2 flex flex-wrap gap-2">
//                             {productImages.map((image, index) => (
//                                 <div key={index} className="relative">
//                                     <img
//                                         src={URL.createObjectURL(image)}
//                                         alt={`Product image ${index + 1}`}
//                                         className="w-20 h-20 object-cover rounded"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => handleRemoveImage(index)}
//                                         className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
//                                     >
//                                         <X size={16} />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                         <Button type="submit" disabled={createProductMutation.status === 'pending'} className="w-full bg-blue-600 text-white">
//                             {createProductMutation.status === 'pending' ? 'Creating...' : 'Create Product'}
//                         </Button>
//                     </form>
//                 </DialogContent>
//             </Dialog>


//             {/* Edit Product Modal */}
//             <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//                 <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-white">
//                     <DialogHeader>
//                         <DialogTitle>Edit Product</DialogTitle>
//                     </DialogHeader>
//                     {editingProduct && (
//                         <form onSubmit={handleUpdate} className="space-y-4 bg-white">
//                             <Input
//                                 name="name"
//                                 value={editingProduct.name}
//                                 onChange={handleEditInputChange}
//                                 placeholder="Product Name"
//                                 required
//                             />
//                             <Textarea
//                                 name="description"
//                                 value={editingProduct.description}
//                                 onChange={handleEditInputChange}
//                                 placeholder="Product Description"
//                                 required
//                             />
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <Input
//                                     name="price"
//                                     type="number"
//                                     value={editingProduct.price}
//                                     onChange={handleEditInputChange}
//                                     placeholder="Price"
//                                     required
//                                 />
//                                 <Input
//                                     name="weight"
//                                     type="number"
//                                     value={editingProduct.weight}
//                                     onChange={handleEditInputChange}
//                                     placeholder="Weight"
//                                     required
//                                 />
//                             </div>

//                             <CategorySelect
//                                 value={editingProduct?.categoryId?.toString() || ''}
//                                 onChange={handleEditCategoryChange}
//                                 openModalFn={() => openAddCategoryModal('edit')}
//                                 categories={categories}
//                             />
//                             <div>
//                                 <Input
//                                     type="file"
//                                     onChange={handleEditImageChange}
//                                     multiple
//                                     accept="image/*"
//                                 />
//                                 <div className="mt-2 flex flex-wrap gap-2">
//                                     {editingProduct.productImages.map((image) => (
//                                         <div key={image.id} className="relative">
//                                             <img
//                                                 src={image.imageUrl}
//                                                 alt={`Product image ${image.id}`}
//                                                 className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => handleRemoveExistingImage(image.id)}
//                                                 className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
//                                             >
//                                                 <X size={16} />
//                                             </button>
//                                         </div>
//                                     ))}
//                                     {editProductImages.map((image, index) => (
//                                         <div key={index} className="relative">
//                                             <img
//                                                 src={URL.createObjectURL(image)}
//                                                 alt={`New product image ${index + 1}`}
//                                                 className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => handleRemoveEditImage(index)}
//                                                 className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
//                                             >
//                                                 <X size={16} />
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                             <Button type="submit" disabled={updateProductMutation.status === 'pending'} className="w-full bg-blue-600 text-white">
//                                 {updateProductMutation.status === 'pending' ? 'Updating...' : 'Update Product'}
//                             </Button>
//                         </form>
//                     )}
//                 </DialogContent>
//             </Dialog>

//             {updateProductMutation.isError && (
//                 <Alert variant="destructive" className="mt-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{(updateProductMutation.error as Error).message}</AlertDescription>
//                 </Alert>
//             )}
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
'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    ColumnDef
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddProductModal from './_components/AddProductModal';
import EditProductModal from './_components/EditProductModal';
import { Pagination } from '@/app/(user)/(main)/product/_components/Pagination';
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';

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

const BASE_URL = 'http://localhost:8080';
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

            <Table className=' p-4 '>
                <TableHeader>
                    <TableRow className='bg-blue-600 hover:bg-transparent-none'>
                        <TableHead className='text-white '>No</TableHead>
                        <TableHead className='text-white'>Image</TableHead>
                        <TableHead className='text-white'>Name</TableHead>
                        <TableHead className='text-white'>Stock</TableHead>
                        <TableHead className='text-white'>Ordered Qty</TableHead>
                        <TableHead className='text-white'>Status</TableHead>
                        <TableHead className='text-white'>Price</TableHead>
                        <TableHead className='text-white'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isPending
                        ? <TableRow><TableCell colSpan={8}><p>Loading...</p></TableCell></TableRow>
                        : data?.content.map((product, index) => (
                            <TableRow key={product.id}>
                                <TableCell>{currentPage * pageSize + index + 1}</TableCell>
                                <TableCell>
                                    <div className="bg-white flex items-center justify-center p-1 w-14 h-14 rounded-xl shadow-md">
                                        {product.productImages.length > 0 && (
                                            <Image
                                                src={product.productImages[0].imageUrl}
                                                alt={product.name}
                                                className="w-12 h-12 object-contain rounded"
                                                width={48}
                                                height={48}
                                            />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.totalStock}</TableCell>
                                <TableCell>20</TableCell>
                                <TableCell>
                                    {product.totalStock > 0 ? (
                                        <Badge className="bg-green-100 text-green-700"> • Available</Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-700"> • Out of Stock</Badge>
                                    )}
                                </TableCell>
                                <TableCell>Rp {product.price.toLocaleString()}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white">
                                            <DropdownMenuItem onClick={() => openEditModal(product)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

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

// 'use client';

// import React, { useState, useCallback, useEffect, useMemo } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
// import axios from 'axios';
// import { useDebouncedCallback } from 'use-debounce';
// import {
//     ColumnDef,
//     ColumnFiltersState,
//     SortingState,
//     VisibilityState,
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     useReactTable,
// } from "@tanstack/react-table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { AlertCircle, MoreVertical, Trash2, Edit, Plus } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import AddProductModal from './_components/AddProductModal';
// import EditProductModal from './_components/EditProductModal';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { DataTablePagination } from './_components/DataTablePagination';

// interface ProductImage {
//     id: number;
//     productId: number;
//     imageUrl: string;
//     createdAt: string;
//     updatedAt: string;
// }
// interface DataTableProps<TData, TValue> {
//     columns: ColumnDef<TData, TValue>[]
//     data: TData[]
//     sorting: SortingState
//     setSorting: React.Dispatch<React.SetStateAction<SortingState>>
//     columnFilters: ColumnFiltersState
//     setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
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

//     const [sorting, setSorting] = useState<SortingState>([]);
//     const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//     const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//     const [rowSelection, setRowSelection] = useState({});

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
//         const offset = parseInt(page) * parseInt(size);
//         params.set('page', offset.toString());
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

//     const handleSearch = (value: string) => {
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
//     const handlePageChange = (newPage: number) => {
//         updateSearchParams({ page: newPage.toString() });
//     };

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

//     const columns: ColumnDef<Product>[] = [
//         {
//             accessorKey: "id",
//             header: "No",
//             cell: ({ row }) => row.index + 1,
//         },
//         {
//             accessorKey: "productImages",
//             header: "Image",
//             cell: ({ row }) => (
//                 row.original.productImages.length > 0 && (
//                     <img
//                         src={row.original.productImages[0].imageUrl}
//                         alt={row.original.name}
//                         className="w-12 h-12 object-cover rounded"
//                     />
//                 )
//             ),
//         },
//         {
//             accessorKey: "name",
//             header: "Name",
//         },
//         {
//             accessorKey: "totalStock",
//             header: "Stock",
//         },
//         {
//             accessorKey: "orderedQty",
//             header: "Ordered Qty",
//             cell: () => 20, // You might want to replace this with actual data
//         },
//         {
//             accessorKey: "status",
//             header: "Status",
//             cell: ({ row }) => (
//                 row.original.totalStock > 0 ? (
//                     <Badge className="bg-green-100 text-green-700"> • Available</Badge>
//                 ) : (
//                     <Badge className="bg-red-100 text-red-700"> • Out of Stock</Badge>
//                 )
//             ),
//         },
//         {
//             accessorKey: "price",
//             header: "Price",
//             cell: ({ row }) => `Rp ${row.original.price.toLocaleString()}`,
//         },
//         {
//             header: "Actions",
//             id: "actions",
//             cell: ({ row }) => (
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                             <MoreVertical className="h-4 w-4" />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="bg-white">
//                         <DropdownMenuItem onClick={() => openEditModal(row.original)}>
//                             <Edit className="mr-2 h-4 w-4" />
//                             <span>Edit</span>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
//                             <Trash2 className="mr-2 h-4 w-4" />
//                             <span>Delete</span>
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             ),
//         },
//     ];



//     const table = useReactTable({
//         data: data?.content || [],
//         columns,
//         onSortingChange: setSorting,
//         onColumnFiltersChange: setColumnFilters,
//         getCoreRowModel: getCoreRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         onColumnVisibilityChange: setColumnVisibility,
//         onRowSelectionChange: setRowSelection,
//         state: {
//             sorting,
//             columnFilters,
//             columnVisibility,
//             rowSelection,
//             pagination: {
//                 pageIndex: currentPage,
//                 pageSize,
//             },
//         },
//         manualPagination: true,
//         pageCount: data?.totalPages ?? -1,
//         onPaginationChange: (updater) => {
//             if (typeof updater === 'function') {
//                 const newPagination = updater(table.getState().pagination);
//                 handlePageChange(newPagination.pageIndex);
//             }
//         },
//     });


//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-6">Product List</h1>

//             <div className="flex items-center py-4">
//                 <Input
//                     placeholder="Search products..."
//                     value={searchTerm}
//                     onChange={(event) => handleSearch(event.target.value)}
//                     className="max-w-sm"
//                 />
//                 <Select value={categoryName} onValueChange={handleCategoryFilterChange}>
//                     <SelectTrigger className="w-[180px] ml-4">
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
//                     <SelectTrigger className="w-[180px] ml-4">
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
//                         <SelectTrigger className="w-[180px] ml-4">
//                             <SelectValue placeholder="Sort Direction" />
//                         </SelectTrigger>
//                         <SelectContent className='bg-white'>
//                             <SelectItem value="asc">Ascending</SelectItem>
//                             <SelectItem value="desc">Descending</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 )}
//                 <Button onClick={() => setIsAddModalOpen(true)} className="ml-4 bg-blue-600 text-white">
//                     <Plus className="mr-2 h-4 w-4" /> Add Product
//                 </Button>
//             </div>

//             {error instanceof Error && (
//                 <Alert variant="destructive" className="mb-6">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error.message}</AlertDescription>
//                 </Alert>
//             )}

//             <div className="rounded-md border">
//                 <Table>
//                     <TableHeader>
//                         {table.getHeaderGroups().map((headerGroup) => (
//                             <TableRow key={headerGroup.id}>
//                                 {headerGroup.headers.map((header) => (
//                                     <TableHead key={header.id}>
//                                         {header.isPlaceholder
//                                             ? null
//                                             : flexRender(
//                                                 header.column.columnDef.header,
//                                                 header.getContext()
//                                             )}
//                                     </TableHead>
//                                 ))}
//                             </TableRow>
//                         ))}
//                     </TableHeader>
//                     <TableBody>
//                         {isPending ? (
//                             <TableRow>
//                                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                                     Loading...
//                                 </TableCell>
//                             </TableRow>
//                         ) : table.getRowModel().rows?.length ? (
//                             table.getRowModel().rows.map((row) => (
//                                 <TableRow
//                                     key={row.id}
//                                     data-state={row.getIsSelected() && "selected"}
//                                 >
//                                     {row.getVisibleCells().map((cell) => (
//                                         <TableCell key={cell.id}>
//                                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                                     No results.
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>

//             <DataTablePagination table={table} totalItems={data?.totalElements || 0} />

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