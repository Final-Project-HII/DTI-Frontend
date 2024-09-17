import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from "next-auth/react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BASE_URL = 'http://localhost:8080';

// Create an axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // This is important for sending cookies
});

interface UpdateStockMutationModalProps {
    stockMutation: StockMutation;
    onUpdate: () => void;
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

interface StockMutationUpdateDto {
    id: number;
    remarks: string;
    status: 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
}

const UpdateStockMutationModal: React.FC<UpdateStockMutationModalProps> = ({ stockMutation, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<StockMutationUpdateDto>({
        id: stockMutation.id,
        remarks: '',
        status: 'COMPLETED',
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (updateData: StockMutationUpdateDto) => {
            if (!session) {
                throw new Error("Not authenticated");
            }
            return api.put('/api/stock-mutations/process', updateData);
        },
        onSuccess: () => {
            // queryClient.invalidateQueries(['stockMutations']);
            setOpen(false);
            onUpdate();
            setSuccessMessage("Stock mutation status updated successfully!");
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

    if (!session) {
        return <div>Please log in to update stock mutations.</div>;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Proccess</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Update Stock Mutation Status</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        value={formData.status}
                        onValueChange={(value: 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED') =>
                            setFormData(prev => ({ ...prev, status: value }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder="Remarks"
                        required
                    />

                    <Button type="submit" disabled={mutation.status === 'pending'} className="w-full bg-blue-600 text-white">
                        {mutation.status === 'pending' ? 'Updating...' : 'Update Status'}
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

export default UpdateStockMutationModal;