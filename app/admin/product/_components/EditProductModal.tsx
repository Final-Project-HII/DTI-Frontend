import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, X } from 'lucide-react';
import CategorySelect from './CategorySelect';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { z } from 'zod';
import { Category, Product } from '@/types/product';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    categories: Category[];
    openAddCategoryModal: (type: 'new' | 'edit') => void;
    token: string;
}

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;

export default function EditProductModal({ isOpen, onClose, product, categories, openAddCategoryModal, token }: EditProductModalProps) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editProductImages, setEditProductImages] = useState<File[]>([]);
    const [deleteImages, setDeleteImages] = useState<number[]>([]);
    // const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (product) {
            setEditingProduct(product);
            setEditProductImages([]);
            setDeleteImages([]);
        }
    }, [product]);

    const updateProductMutation = useMutation({
        mutationFn: async ({ id, formData }: { id: number, formData: FormData }) => {
            const response = await axios.put(`${BASE_URL}/product/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            onClose();
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'The product has been successfully updated.',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error: any) => {
            let errorMessage = 'An error occurred while updating the product.';
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
                showConfirmButton: false
            });
        }
    });

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditingProduct(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleEditCategoryChange = (categoryId: string) => {
        setEditingProduct(prev => prev ? { ...prev, categoryId: parseInt(categoryId) } : null);
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setEditProductImages(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const handleRemoveEditImage = (index: number) => {
        setEditProductImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (imageId: number) => {
        setDeleteImages(prev => [...prev, imageId]);
        setEditingProduct(prev =>
            prev ? {
                ...prev,
                productImages: prev.productImages.filter(img => img.id !== imageId)
            } : null
        );
    };

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingProduct) return;

        const formData = new FormData();

        // Create the product JSON
        const productJson = {
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price.toString(),
            weight: editingProduct.weight,
            categoryId: editingProduct.categoryId,
            deleteImages: deleteImages
        };

        // Append the product JSON as a string
        formData.append('product', JSON.stringify(productJson));

        // Append each new image
        editProductImages.forEach((image) => {
            formData.append('newImages', image);
        });

        updateProductMutation.mutate({ id: editingProduct.id, formData });
    };

    if (!editingProduct) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdate} className="space-y-4 bg-white">
                    <Input
                        name="name"
                        value={editingProduct.name}
                        onChange={handleEditInputChange}
                        placeholder="Product Name"
                        required
                    />
                    <Textarea
                        name="description"
                        value={editingProduct.description}
                        onChange={handleEditInputChange}
                        placeholder="Product Description"
                        required
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            name="price"
                            type="number"
                            value={editingProduct.price}
                            onChange={handleEditInputChange}
                            placeholder="Price"
                            required
                        />
                        <Input
                            name="weight"
                            type="number"
                            value={editingProduct.weight}
                            onChange={handleEditInputChange}
                            placeholder="Weight"
                            required
                        />
                    </div>

                    <CategorySelect
                        value={editingProduct.categoryId.toString()}
                        onChange={handleEditCategoryChange}
                        openModalFn={() => openAddCategoryModal('edit')}
                        categories={categories}
                    />
                    <div>
                        <Input
                            type="file"
                            onChange={handleEditImageChange}
                            multiple
                            accept="image/*"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                            {editingProduct.productImages.map((image) => (
                                <div key={image.id} className="relative">
                                    <img
                                        src={image.imageUrl}
                                        alt={`Product image ${image.id}`}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(image.id)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            {editProductImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`New product image ${index + 1}`}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveEditImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button type="submit" disabled={updateProductMutation.status === 'pending'} className="w-full bg-blue-600 text-white">
                        {updateProductMutation.status === 'pending' ? 'Updating...' : 'Update Product'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}