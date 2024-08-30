import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import CategorySelect from './CategorySelect';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: number, formData: FormData) => void;
    categories: Category[];
    editingProduct: Product | null;
    updateProductMutation: {
        status: 'idle' | 'pending' | 'success' | 'error';
    };
    openAddCategoryModal: (type: 'new' | 'edit') => void;
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
    productImages: ProductImage[];
}

interface ProductImage {
    id: number;
    imageUrl: string;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    categories,
    editingProduct,
    updateProductMutation,
    openAddCategoryModal
}) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [editProductImages, setEditProductImages] = useState<File[]>([]);
    const [deleteImages, setDeleteImages] = useState<number[]>([]);

    useEffect(() => {
        if (editingProduct) {
            setProduct(editingProduct);
        }
    }, [editingProduct]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleCategoryChange = (categoryId: string) => {
        setProduct(prev => prev ? { ...prev, categoryId: parseInt(categoryId) } : null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setEditProductImages(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const handleRemoveEditImage = (index: number) => {
        setEditProductImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (imageId: number) => {
        setDeleteImages(prev => [...prev, imageId]);
        setProduct(prev =>
            prev ? {
                ...prev,
                productImages: prev.productImages.filter(img => img.id !== imageId)
            } : null
        );
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!product) return;

        const formData = new FormData();

        const productJson = {
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            weight: product.weight,
            categoryId: product.categoryId,
            deleteImages: deleteImages
        };

        formData.append('product', JSON.stringify(productJson));

        editProductImages.forEach((image) => {
            formData.append('newImages', image);
        });

        onSubmit(product.id, formData);
    };

    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 bg-white">
                    <Input
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        placeholder="Product Name"
                        required
                    />
                    <Textarea
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        placeholder="Product Description"
                        required
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            name="price"
                            type="number"
                            value={product.price}
                            onChange={handleInputChange}
                            placeholder="Price"
                            required
                        />
                        <Input
                            name="weight"
                            type="number"
                            value={product.weight}
                            onChange={handleInputChange}
                            placeholder="Weight"
                            required
                        />
                    </div>

                    <CategorySelect
                        value={product.categoryId.toString()}
                        onChange={handleCategoryChange}
                        openModalFn={() => openAddCategoryModal('edit')}
                        categories={categories}
                    />
                    <Input
                        type="file"
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                        {product.productImages.map((image) => (
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
                    <Button type="submit" disabled={updateProductMutation.status === 'pending'} className="w-full bg-blue-600 text-white">
                        {updateProductMutation.status === 'pending' ? 'Updating...' : 'Update Product'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductModal;