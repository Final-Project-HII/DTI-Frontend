import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import CategorySelect from './CategorySelect';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { z } from 'zod';

interface Category {
    id: number;
    name: string;
}

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    openAddCategoryModal: (type: 'new' | 'edit') => void;
    token: string;
}

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;
const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.string().min(1, "Price is required").regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
    weight: z.string().min(1, "Weight is required").regex(/^\d+(\.\d{1,3})?$/, "Invalid weight format"),
    categoryId: z.string().min(1, "Category is required"),
});

const imageSchema = z.array(z.instanceof(File))
    .refine((files) => files.every(file => file.size <= 1000000), "Each image must be less than 1MB")
    .refine((files) => files.every(file => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)),
        "Only .jpg, .jpeg, .png, and .gif formats are supported");

export default function AddProductModal({ isOpen, onClose, categories, openAddCategoryModal, token }: AddProductModalProps) {
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        weight: '',
        categoryId: '',
    });
    const [productImages, setProductImages] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // State untuk pesan sukses


    const queryClient = useQueryClient();

    const createProductMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await axios.post(`${BASE_URL}/product/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            resetForm();
            onClose();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Product successfully created!',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error: any) => {
            let errorMessage = 'An error occurred while add the product.';
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
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (categoryId: string) => {
        setNewProduct(prev => ({ ...prev, categoryId }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProductImages(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setProductImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            productSchema.parse(newProduct);
            imageSchema.parse(productImages);

            const formData = new FormData();
            Object.entries(newProduct).forEach(([key, value]) => {
                formData.append(key, value);
            });
            productImages.forEach((image) => {
                formData.append('productImages', image);
            });
            createProductMutation.mutate(formData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: error.errors[0].message,
                    confirmButtonColor: '#3085d6',
                });
            }
        }
    };

    const resetForm = () => {
        setNewProduct({
            name: '',
            description: '',
            price: '',
            weight: '',
            categoryId: '',
        });
        setProductImages([]);
        setErrorMessage(null);
        setSuccessMessage(null); // Reset pesan sukses
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        placeholder="Product Name"
                        required
                    />
                    <Textarea
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        placeholder="Product Description"
                        required
                    />
                    <Input
                        name="price"
                        type="number"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                        required
                    />
                    <Input
                        name="weight"
                        type="number"
                        value={newProduct.weight}
                        onChange={handleInputChange}
                        placeholder="Weight"
                        required
                    />

                    <CategorySelect
                        value={newProduct.categoryId}
                        onChange={handleCategoryChange}
                        openModalFn={() => openAddCategoryModal('new')}
                        categories={categories}
                    />
                    <Input
                        type="file"
                        onChange={handleImageChange}
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                        {productImages.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Product image ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <Button type="submit" disabled={createProductMutation.status === 'pending'} className="w-full bg-blue-600 text-white">
                        {createProductMutation.status === 'pending' ? 'Creating...' : 'Create Product'}
                    </Button>
                </form>
                {/* {errorMessage && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
                {successMessage && (
                    <Alert className="mt-4 bg-green-100 text-green-700 border border-green-500">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )} */}

            </DialogContent>
        </Dialog>
    );
}
