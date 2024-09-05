'use client'
import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2, Edit, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Category {
    id: number;
    name: string;
    imageUrl: string;
    products: number[];
    createdAt: string;
    updatedAt: string;
}
const categoryImages = [
    "/api/placeholder/50/50?text=Food",
    "/api/placeholder/50/50?text=Electronics",
    "/api/placeholder/50/50?text=Clothing",
    "/api/placeholder/50/50?text=Books",
    "/api/placeholder/50/50?text=Toys",
];

const BASE_URL = 'http://localhost:8080';

export default function CategoryManagementPage() {
    const queryClient = useQueryClient();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const fetchCategories = async (): Promise<Category[]> => {
        const response = await axios.get<Category[]>(`${BASE_URL}/category`);
        return response.data;
    };

    const { data: categories, isPending, error } = useQuery<Category[], Error>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const createCategoryMutation = useMutation({
        mutationFn: async (name: string) => {
            const response = await axios.post(`${BASE_URL}/category/create`, { name });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsAddModalOpen(false);
            setNewCategoryName('');
        },
    });

    const updateCategoryMutation = useMutation({
        mutationFn: async ({ id, name }: { id: number; name: string }) => {
            const response = await axios.put(`${BASE_URL}/category/update/${id}`, { name });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsEditModalOpen(false);
            setEditingCategory(null);
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

    const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createCategoryMutation.mutate(newCategoryName);
    };

    const handleUpdateCategory = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingCategory) {
            updateCategoryMutation.mutate({ id: editingCategory.id, name: editingCategory.name });
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

            <Table className="w-full className='bg-white p-4 rounded-md'">
                <TableHeader>
                    <TableRow >
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
                                    <img src='/header.svg' alt='category.name' className="w-12 h-12 object-cover rounded" />
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
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Category Name"
                            required
                        />
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
