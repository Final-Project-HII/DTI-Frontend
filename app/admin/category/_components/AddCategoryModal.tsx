import React, { useState } from 'react';
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

interface CategoryRequestDto {
    name: string;
}

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string;
}

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;
const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    image: z.instanceof(File)
        .refine((file) => file.size <= 1000000, `Max image size is 1MB`)
        .refine(
            (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type),
            'Only .jpg, .jpeg, .png, and .gif formats are supported'
        )
        .optional()
});

export default function AddCategoryModal({ isOpen, onClose, token }: AddCategoryModalProps) {
    const queryClient = useQueryClient();
    const [newCategory, setNewCategory] = useState<CategoryRequestDto>({ name: '' });
    const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

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
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            onClose();
            setNewCategory({ name: '' });
            setNewCategoryImage(null);
            Swal.fire({
                icon: 'success',
                title: 'Added!',
                text: 'The new category has been successfully added.',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error: any) => {
            let errorMessage = 'An error occurred while adding the new category.';
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
            setNewCategoryImage(e.target.files[0]);
        }
    };

    const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidationError(null);

        try {
            categorySchema.parse({
                name: newCategory.name,
                image: newCategoryImage
            });
            createCategoryMutation.mutate({ categoryData: newCategory, image: newCategoryImage });
        } catch (error) {
            if (error instanceof z.ZodError) {
                setValidationError(error.errors[0].message);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
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
                            onChange={handleFileChange}
                            accept="image/jpeg,image/jpg,image/png,image/gif"
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
                    {validationError && (
                        <p className="text-red-500">{validationError}</p>
                    )}
                    <Button type="submit" disabled={createCategoryMutation.isPending} className="w-full bg-blue-600 text-white">
                        {createCategoryMutation.isPending ? 'Adding...' : 'Add Category'}
                    </Button>
                </form>
                {/* {createCategoryMutation.isError && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{createCategoryMutation.error.message}</AlertDescription>
                    </Alert>
                )} */}
            </DialogContent>
        </Dialog>
    );
}