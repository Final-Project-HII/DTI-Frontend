import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface UpdateStockModalProps {
    stockItem: StockItem;
    selectedWarehouse: string;
    onUpdate: () => void;
}

interface StockItem {
    id: string;
    productName: string;
    quantity: number;
    warehouseName: string;
    updatedAt: string;
    createdAt: string;
    warehouseId: string;
    productId: string;
    productImageUrl: string;
    price: number;
    weight: number;
    categoryId: string;
    categoryName: string;
}
// const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;
const BASE_URL = 'http://localhost:8080/api';
const UpdateStockModal: React.FC<UpdateStockModalProps> = ({ stockItem, selectedWarehouse, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(stockItem.quantity.toString());
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (updateData: { productId: string; quantity: number; warehouseId: string }) => {
            const response = await axios.put(
                `${BASE_URL}/stocks/${stockItem.id}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user?.accessToken}`,
                    },
                    withCredentials: true,
                }
            );
            return response.data;
        },
        onSuccess: () => {
            setOpen(false);
            onUpdate();
            queryClient.invalidateQueries({ queryKey: ['stock'] });
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Stock updated successfully!',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error: any) => {
            let errorMessage = 'An unexpected error occurred while updating the stock.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate({
            productId: stockItem.productId,
            quantity: Number(quantity),
            warehouseId: selectedWarehouse || stockItem.warehouseId,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-blue-500 text-white hover:text-white hover:bg-blue-600">Update Stock</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">Update Stock for {stockItem.productName}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                            New Quantity
                        </label>
                        <Input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter new quantity"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-50 "
                        />
                    </div>
                    <Button
                        type="submit"
                        // disabled={mutation.isLoading || mutation.isPending}
                        className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Stock'
                        )}
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
                    <Alert variant="default" className="mt-4 bg-green-100 border-green-400 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UpdateStockModal;