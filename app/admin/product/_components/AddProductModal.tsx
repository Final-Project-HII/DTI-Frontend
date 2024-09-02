import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import CategorySelect from './CategorySelect';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    categories: Category[];
    createProductMutation: {
        status: 'idle' | 'pending' | 'success' | 'error';
    };
    openAddCategoryModal: (type: 'new' | 'edit') => void;
}

interface Category {
    id: number;
    name: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    categories,
    createProductMutation,
    openAddCategoryModal
}) => {
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        weight: '',
        categoryId: '',
    });
    const [productImages, setProductImages] = useState<File[]>([]);

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
        const formData = new FormData();
        Object.entries(newProduct).forEach(([key, value]) => {
            formData.append(key, value);
        });
        productImages.forEach((image) => {
            formData.append('productImages', image);
        });
        onSubmit(formData);
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
                        accept="image/*"
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
            </DialogContent>
        </Dialog>
    );
};

export default AddProductModal;