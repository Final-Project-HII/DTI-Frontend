import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Package } from 'lucide-react';
import WarehouseSelect from '../WarehouseSelect';

interface Warehouse {
    id: number;
    name: string;
}

interface Stock {
    id: number;
    productId: number;
    warehouseId: number;
    quantity: number;
}

interface UpdateStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    warehouses: Warehouse[];
    stock: Stock | null;
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

export default function UpdateStockModal({ isOpen, onClose, warehouses, stock, products }: UpdateStockModalProps) {
    const [updatedStock, setUpdatedStock] = useState<Stock | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [currentStocks, setCurrentStocks] = useState<Stocks[]>([]);
    const [selectedStockId, setSelectedStockId] = useState<number | null>(null);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (stock) {
            setUpdatedStock(stock);
            const product = products.find(p => p.id === stock.productId);
            if (product) {
                setCurrentStocks(product.stocks);
            }
        }
    }, [stock, products]);

    const updateStockMutation = useMutation({
        mutationFn: async (formData: { productId: number, warehouseId: number, quantity: number }) => {
            const response = await axios.put(`${BASE_URL}/api/stocks/${selectedStockId}`, formData);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setSuccessMessage("Stock updated successfully!");
            setCurrentStocks(prevStocks =>
                prevStocks.map(s =>
                    s.id === data.data.id ? { ...s, quantity: data.data.quantity } : s
                )
            );
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || 'An unexpected error occurred.');
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedStock(prev => prev ? { ...prev, [name]: parseInt(value) } : null);
    };

    const handleWarehouseChange = (warehouseId: string) => {
        setUpdatedStock(prev => prev ? { ...prev, warehouseId: parseInt(warehouseId) } : null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (updatedStock && selectedStockId) {
            updateStockMutation.mutate({
                productId: updatedStock.productId,
                warehouseId: updatedStock.warehouseId,
                quantity: updatedStock.quantity
            });
        }
    };

    const handleSelectStock = (stockId: number) => {
        setSelectedStockId(stockId);
        const selectedStock = currentStocks.find(s => s.id === stockId);
        if (selectedStock) {
            setUpdatedStock({
                id: selectedStock.id,
                productId: stock?.productId || 0,
                warehouseId: selectedStock.warehouseId,
                quantity: selectedStock.quantity
            });
        }
    };

    if (!stock) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center mb-4">Update Stock</DialogTitle>
                </DialogHeader>
                <div className="flex space-x-6">
                    <div className="w-1/2 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3 text-lg">Select Stock to Update:</h3>
                        <ul className="space-y-2">
                            {currentStocks.map((stock) => (
                                <li
                                    key={stock.id}
                                    className={`cursor-pointer p-2 rounded transition-colors duration-200 ease-in-out
                                        ${selectedStockId === stock.id
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'hover:bg-gray-200'}`}
                                    onClick={() => handleSelectStock(stock.id)}
                                >
                                    <Package className="inline-block mr-2" size={18} />
                                    <span className="font-medium">{stock.warehouseName}:</span> {stock.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-1/2">
                        {selectedStockId && updatedStock ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                                    <WarehouseSelect
                                        value={updatedStock.warehouseId.toString()}
                                        onChange={handleWarehouseChange}
                                        warehouses={warehouses}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <Input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        value={updatedStock.quantity}
                                        onChange={handleInputChange}
                                        placeholder="Enter new quantity"
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={updateStockMutation.status === 'pending'}
                                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                                >
                                    {updateStockMutation.status === 'pending' ? 'Updating...' : 'Update Stock'}
                                </Button>
                            </form>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Select a stock to update
                            </div>
                        )}
                    </div>
                </div>
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
            </DialogContent>
        </Dialog>
    );
}