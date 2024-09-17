import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from 'lucide-react';
import WarehouseSelect from '../WarehouseSelect';

interface Warehouse {
    id: number;
    name: string;
}

interface AddStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    warehouses: Warehouse[];
    productId: number;
    products: Product[];
}

interface ProductImage {
    id: number;
    productId: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    weight: number;
    categoryId: number;
    categoryName: string;
    totalStock: number;
    productImages: ProductImage[];
    stocks: Stocks[];
    createdAt: string;
    updatedAt: string;
}

interface Stocks {
    id: number;
    warehouseId: number;
    warehouseName: string;
    quantity: number;
}

const BASE_URL = 'http://localhost:8080';

export default function AddStockModal({ isOpen, onClose, warehouses, productId, products }: AddStockModalProps) {
    const [newStock, setNewStock] = useState({
        warehouseId: '',
        quantity: '',
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [currentStocks, setCurrentStocks] = useState<Stocks[]>([]);

    const queryClient = useQueryClient();

    useEffect(() => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setCurrentStocks(product.stocks);
        }
    }, [productId, products]);

    const createStockMutation = useMutation({
        mutationFn: async (formData: { productId: number; warehouseId: number; quantity: number }) => {
            const response = await axios.post(`${BASE_URL}/api/stocks`, formData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            resetForm();
            setSuccessMessage("Stock successfully added!");
        },
        onError: (error: any) => {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewStock(prev => ({ ...prev, [name]: value }));
    };

    const handleWarehouseChange = (warehouseId: string) => {
        setNewStock(prev => ({ ...prev, warehouseId }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createStockMutation.mutate({
            productId,
            warehouseId: parseInt(newStock.warehouseId),
            quantity: parseInt(newStock.quantity)
        });
    };

    const resetForm = () => {
        setNewStock({
            warehouseId: '',
            quantity: '',
        });
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add Stock</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <WarehouseSelect
                        placeholder="Select Warehouse"
                        value={newStock.warehouseId}
                        onChange={handleWarehouseChange}
                        warehouses={warehouses}
                    />
                    <Input
                        name="quantity"
                        type="number"
                        value={newStock.quantity}
                        onChange={handleInputChange}
                        placeholder="Quantity"
                        required
                    />
                    <Button type="submit" disabled={createStockMutation.status === 'pending'} className="w-full bg-blue-600 text-white">
                        {createStockMutation.status === 'pending' ? 'Adding...' : 'Add Stock'}
                    </Button>
                </form>
                {errorMessage && (
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
                )}
                {currentStocks.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">Current Stock:</h3>
                        <ul className="list-disc pl-5">
                            {currentStocks.map((stock) => (
                                <li key={stock.id}>
                                    {stock.warehouseName}: {stock.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}