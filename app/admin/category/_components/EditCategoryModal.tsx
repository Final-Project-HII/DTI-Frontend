import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from 'next/image';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { z } from 'zod';

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

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;
const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    image: z.instanceof(File).nullable().refine(
        (file) => file === null || (file && file.size <= 1000000),
        'Max image size is 1MB'
    ).refine(
        (file) => file === null || (file && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)),
        'Only .jpg, .jpeg, .png, and .gif formats are supported'
    )
});

export default function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
    const queryClient = useQueryClient();
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingCategoryImage, setEditingCategoryImage] = useState<File | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

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
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'The category has been successfully updated.',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error: any) => {
            let errorMessage = 'An error occurred while updating the category.';
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
                confirmButtonColor: '#3085d6',
                timer: 3000,
                timerProgressBar: true,
                toast: true,
                // position: 'top-end',
                showConfirmButton: false
            });
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setEditingCategoryImage(e.target.files[0]);
        }
    };

    const handleUpdateCategory = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidationError(null);

        if (editingCategory) {
            try {
                categorySchema.parse({
                    name: editingCategory.name,
                    image: editingCategoryImage
                });
                const categoryData: CategoryRequestDto = { name: editingCategory.name };
                updateCategoryMutation.mutate({ id: editingCategory.id, categoryData, image: editingCategoryImage });
            } catch (error) {
                if (error instanceof z.ZodError) {
                    setValidationError(error.errors[0].message);
                }
            }
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
                            accept="image/jpeg,image/jpg,image/png,image/gif"
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
                    {validationError && (
                        <p className="text-red-500">{validationError}</p>
                    )}
                    <Button type="submit" disabled={updateCategoryMutation.isPending} className="w-full bg-blue-600 text-white">
                        {updateCategoryMutation.isPending ? 'Updating...' : 'Update Category'}
                    </Button>
                </form>
                {/* {updateCategoryMutation.isError && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{updateCategoryMutation.error.message}</AlertDescription>
                    </Alert>
                )} */}
            </DialogContent>
        </Dialog>
    );
}