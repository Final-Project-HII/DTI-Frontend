import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from 'next/image';

interface CategoryRequestDto {
    name: string;
}

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BASE_URL = 'http://localhost:8080/api';

export default function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
    const queryClient = useQueryClient();
    const [newCategory, setNewCategory] = useState<CategoryRequestDto>({ name: '' });
    const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);

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
            onClose();
            setNewCategory({ name: '' });
            setNewCategoryImage(null);
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewCategoryImage(e.target.files[0]);
        }
    };

    const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createCategoryMutation.mutate({ categoryData: newCategory, image: newCategoryImage });
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
                {createCategoryMutation.isError && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{createCategoryMutation.error.message}</AlertDescription>
                    </Alert>
                )}
            </DialogContent>
        </Dialog>
    );
}