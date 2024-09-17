import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
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
import { AlertCircle, CheckCircle } from 'lucide-react';
import WarehouseSelect from '../../../management/_components/WarehouseSelect';
import ProductSelect from '../ProductSelect';
import { useSession } from "next-auth/react";

const BASE_URL = 'http://localhost:8080';

interface Stock {
    id: number;
    productId: number;
    productName: string;
    warehouseId: number;
    warehouseName: string;
    quantity: number;
}

interface StockMutation {
    id: number;
    productId: number;
    productName: string;
    productImageUrl: string;
    originWarehouseId: number;
    originWarehouseName: string;
    destinationWarehouseId: number;
    destinationWarehouseName: string;
    quantity: number;
    status: 'REQUESTED' | 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
    mutationType: 'MANUAL' | 'AUTOMATIC';
    remarks: string | null;
}

interface FormData {
    productId: string;
    originWarehouseId: string;
    destinationWarehouseId: string;
    quantity: string;
}

interface Warehouse {
    id: number;
    name: string;
    // Add other relevant properties
}

interface CreateStockMutationModalProps {
    warehouses: Warehouse[];
    refetchMutations: () => void;
}

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

const CreateStockMutationModal: React.FC<CreateStockMutationModalProps> = ({ warehouses, refetchMutations }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        productId: '',
        originWarehouseId: '',
        destinationWarehouseId: '',
        quantity: '',
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const { data: session } = useSession();

    const { data: allStocks, refetch: refetchStocks } = useQuery<Stock[]>({
        queryKey: ['allStocks'],
        queryFn: async () => {
            const response = await api.get('/api/stocks');
            return response.data.data;
        },
        enabled: open, // Fetch when modal is opened
    });

    useEffect(() => {
        if (open) {
            refetchStocks();
        }
    }, [open, refetchStocks]);

    const mutation = useMutation<any, Error, FormData>({
        mutationFn: (newMutation) => {
            return api.post('/api/stock-mutations/manual', newMutation);
        },
        onSuccess: () => {
            setOpen(false);
            refetchMutations();
            resetForm();
            setSuccessMessage("Stock mutation successfully created!");
        },
        onError: (error: any) => {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            productId: '',
            originWarehouseId: '',
            destinationWarehouseId: '',
            quantity: '',
        });
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const availableStocks = allStocks?.filter(stock => stock.productId.toString() === formData.productId) || [];

    if (!session) {
        return <div>Please log in to access this feature.</div>;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-center bg-blue-600 text-white">+ Create Stock Mutation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Create Stock Mutation</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <ProductSelect
                        value={formData.productId}
                        onChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
                        placeholder="Select product"
                    />

                    {formData.productId && availableStocks.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Available Stock:</h3>
                            <ul className="list-disc pl-5">
                                {availableStocks.map((stock) => (
                                    <li key={stock.id}>
                                        {stock.warehouseName}: {stock.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <WarehouseSelect
                        value={formData.originWarehouseId}
                        onChange={(value) => setFormData(prev => ({ ...prev, originWarehouseId: value }))}
                        warehouses={warehouses}
                        placeholder="Select origin warehouse"
                    />

                    <WarehouseSelect
                        value={formData.destinationWarehouseId}
                        onChange={(value) => setFormData(prev => ({ ...prev, destinationWarehouseId: value }))}
                        warehouses={warehouses}
                        placeholder="Select destination warehouse"
                    />

                    <Input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        required
                    />

                    <Button type="submit" disabled={mutation.status === 'pending'} className="w-full bg-blue-600 text-white">
                        {mutation.status === 'pending' ? 'Creating...' : 'Create Stock Mutation'}
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
            </DialogContent>
        </Dialog>
    );
};

export default CreateStockMutationModal;