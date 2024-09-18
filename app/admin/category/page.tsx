'use client'
import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2, Edit, Plus, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from 'next/image';

interface Category {
    id: number;
    name: string;
    categoryImage: string;
    products: number[];
    createdAt: string;
    updatedAt: string;
}

interface CategoryRequestDto {
    name: string;
}


const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;

export default function CategoryManagementPage() {
    const queryClient = useQueryClient();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState<CategoryRequestDto>({ name: '' });
    const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingCategoryImage, setEditingCategoryImage] = useState<File | null>(null);

    const fetchCategories = async (): Promise<Category[]> => {
        const response = await axios.get<Category[]>(`${BASE_URL}/category`);
        return response.data;
    };

    const { data: categories, isPending, error } = useQuery<Category[], Error>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const createCategoryMutation = useMutation({
        mutationFn: async ({ categoryData, image }: { categoryData: CategoryRequestDto; image: File | null }) => {
            const formData = new FormData();
            formData.append('categoriesData', JSON.stringify(categoryData));
            if (image) {
                formData.append('image', image);
            }
            const response = await axios.post(`${BASE_URL}/category/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsAddModalOpen(false);
            setNewCategory({ name: '' });
            setNewCategoryImage(null);
        },
    });

    const updateCategoryMutation = useMutation({
        mutationFn: async ({ id, categoryData, image }: { id: number; categoryData: CategoryRequestDto; image: File | null }) => {
            const formData = new FormData();
            formData.append('categoriesData', JSON.stringify(categoryData));
            if (image) {
                formData.append('image', image);
            }
            const response = await axios.put(`${BASE_URL}/category/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsEditModalOpen(false);
            setEditingCategory(null);
            setEditingCategoryImage(null);
        },
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`${BASE_URL}/category/delete/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }, []);

    const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createCategoryMutation.mutate({ categoryData: newCategory, image: newCategoryImage });
    };

    const handleUpdateCategory = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingCategory) {
            const categoryData: CategoryRequestDto = { name: editingCategory.name };
            updateCategoryMutation.mutate({ id: editingCategory.id, categoryData, image: editingCategoryImage });
        }
    };

    const handleDeleteCategory = (id: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategoryMutation.mutate(id);
        }
    };
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Category Management</h1>

            <Button onClick={() => setIsAddModalOpen(true)} className="mb-4 bg-blue-600 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}

            <Table className="w-full bg-white p-4 rounded-md">
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead className='text-center'>Category Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className='text-center'>Product Quantity</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead className='text-center'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isPending ? (
                        <TableRow>
                            <TableCell colSpan={7}><p>Loading...</p></TableCell>
                        </TableRow>
                    ) : (
                        categories?.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell className='flex justify-center'>
                                    <div className="bg-white flex items-center justify-center p-1 w-14 h-14 rounded-xl shadow-md">
                                        <Image
                                            src={category.categoryImage ? category.categoryImage.startsWith('http') ? category.categoryImage : `https://res.cloudinary.com/dcjjcs49e/image/upload/${category.categoryImage}` : "/food.png"}
                                            alt={category.name}
                                            width={48}
                                            height={48}
                                            className="object-contain"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell className='text-center'>{category.products.length}</TableCell>
                                <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(category.updatedAt).toLocaleDateString()}</TableCell>
                                <TableCell className='text-center'>
                                    <Button variant="ghost" onClick={() => {
                                        setEditingCategory(category);
                                        setIsEditModalOpen(true);
                                    }}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                    <Button variant="ghost" onClick={() => handleDeleteCategory(category.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Add Category Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white">
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                        <Input
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            placeholder="Category Name"
                            required
                        />
                        <div className="flex items-center space-x-2">
                            <Input
                                type="file"
                                onChange={(e) => handleFileChange(e, setNewCategoryImage)}
                                accept="image/*"
                            />
                            <Upload className="h-4 w-4" />
                        </div>
                        {newCategoryImage && (
                            <div className="mt-2">
                                <Image
                                    src={URL.createObjectURL(newCategoryImage)}
                                    alt="New category preview"
                                    width={100}
                                    height={100}
                                    className="object-contain"
                                />
                            </div>
                        )}
                        <Button type="submit" disabled={createCategoryMutation.isPending} className="w-full bg-blue-600 text-white">
                            {createCategoryMutation.isPending ? 'Adding...' : 'Add Category'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Category Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white">
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    {editingCategory && (
                        <form onSubmit={handleUpdateCategory} className="space-y-4">
                            <Input
                                value={editingCategory.name}
                                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                placeholder="Category Name"
                                required
                            />
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, setEditingCategoryImage)}
                                    accept="image/*"
                                />
                                <Upload className="h-4 w-4" />
                            </div>
                            {editingCategoryImage ? (
                                <div className="mt-2">
                                    <Image
                                        src={URL.createObjectURL(editingCategoryImage)}
                                        alt="Editing category preview"
                                        width={100}
                                        height={100}
                                        className="object-contain"
                                    />
                                </div>
                            ) : editingCategory.categoryImage && (
                                <div className="mt-2">
                                    <Image
                                        src={editingCategory.categoryImage.startsWith('http') ? editingCategory.categoryImage : `https://res.cloudinary.com/dcjjcs49e/image/upload/${editingCategory.categoryImage}`}
                                        alt="Current category image"
                                        width={100}
                                        height={100}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <Button type="submit" disabled={updateCategoryMutation.isPending} className="w-full bg-blue-600 text-white">
                                {updateCategoryMutation.isPending ? 'Updating...' : 'Update Category'}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {createCategoryMutation.isError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{createCategoryMutation.error?.message}</AlertDescription>
                </Alert>
            )}

            {updateCategoryMutation.isError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{updateCategoryMutation.error?.message}</AlertDescription>
                </Alert>
            )}

            {deleteCategoryMutation.isError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{deleteCategoryMutation.error?.message}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}