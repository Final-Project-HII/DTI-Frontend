import React, { useState, useEffect } from 'react';
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
import { AlertCircle, CheckCircle, Loader2, Plus } from 'lucide-react';
import ProductSelect from '../ProductSelect';
import WarehouseSelect from '../WarehouseSelect';
import Swal from 'sweetalert2';

interface AddStockModalProps {
    warehouses: Warehouse[];
    onAdd: () => void;
    selectedWarehouse: string;
}

interface City {
    id: number;
    name: string;
}

interface Warehouse {
    id: number;
    name: string;
    addressLine: string;
    city: City;
}
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;

const AddStockModal: React.FC<AddStockModalProps> = ({ warehouses, onAdd, selectedWarehouse }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        productId: '',
        warehouseId: selectedWarehouse,
        quantity: '',
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { data: session } = useSession();
    const queryClient = useQueryClient();

    useEffect(() => {
        setFormData(prev => ({ ...prev, warehouseId: selectedWarehouse }));
    }, [selectedWarehouse]);

    const mutation = useMutation({
        mutationFn: async (newStock: { productId: string; warehouseId: string; quantity: number }) => {
            const response = await axios.post(
                `${BASE_URL}/stocks`,
                newStock,
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
            onAdd();
            queryClient.invalidateQueries({ queryKey: ['stock'] });
            setFormData({ productId: '', warehouseId: selectedWarehouse, quantity: '' });
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Stock added successfully!',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error: any) => {
            let errorMessage = 'An error occurred while adding the stock.';
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
            productId: formData.productId,
            warehouseId: formData.warehouseId,
            quantity: Number(formData.quantity),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="hover:text-white text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white "><Plus className='w-4 h-4 mr-2' strokeWidth={3} />
                    Add Stock
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">Add New Stock</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <ProductSelect
                        value={formData.productId}
                        onChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
                        placeholder="Select product"
                        selectedWarehouse={selectedWarehouse}
                    />
                    <WarehouseSelect
                        value={formData.warehouseId}
                        onChange={(value) => setFormData(prev => ({ ...prev, warehouseId: value }))}
                        warehouses={warehouses}
                        placeholder="Select warehouse"
                        disabled={!!selectedWarehouse}
                    />
                    <Input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            'Add Stock'
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

export default AddStockModal;