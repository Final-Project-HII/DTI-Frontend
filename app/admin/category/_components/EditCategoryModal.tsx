import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from 'next/image';

interface Category {
    id: number;
    name: string;
    categoryImage: string;
}

interface CategoryRequestDto {
    name: string;
}

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
}

const BASE_URL = 'http://localhost:8080/api';

export default function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
    const queryClient = useQueryClient();
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingCategoryImage, setEditingCategoryImage] = useState<File | null>(null);

    useEffect(() => {
        if (category) {
            setEditingCategory(category);
        }
    }, [category]);

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
            onClose();
            setEditingCategory(null);
            setEditingCategoryImage(null);
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setEditingCategoryImage(e.target.files[0]);
        }
    };

    const handleUpdateCategory = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingCategory) {
            const categoryData: CategoryRequestDto = { name: editingCategory.name };
            updateCategoryMutation.mutate({ id: editingCategory.id, categoryData, image: editingCategoryImage });
        }
    };

    if (!editingCategory) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
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
                            onChange={handleFileChange}
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
                {updateCategoryMutation.isError && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{updateCategoryMutation.error.message}</AlertDescription>
                    </Alert>
                )}
            </DialogContent>
        </Dialog>
    );
}