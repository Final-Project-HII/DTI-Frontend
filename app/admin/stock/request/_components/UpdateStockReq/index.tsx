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
    withCredentials: true,
});

interface UpdateStockMutationModalProps {
    stockMutation: StockMutation;
    onUpdate: () => void;
    disabled?: boolean;
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
    status: 'CANCELLED'; // Allow only CANCELLED status
}

const UpdateStockMutationModal: React.FC<UpdateStockMutationModalProps> = ({ stockMutation, onUpdate, disabled }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<StockMutationUpdateDto>({
        id: stockMutation.id,
        remarks: '',
        status: 'CANCELLED', // Default to CANCELLED for clarity
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

    const renderSelectOptions = () => {
        // Show options based on the current status
        if (stockMutation.status === 'REQUESTED') {
            return <SelectItem value="CANCELLED">Cancelled</SelectItem>;
        }
        return null; // No other options available
    };

    const isButtonDisabled = stockMutation.status !== 'REQUESTED';

    if (!session) {
        return <div>Please log in to update stock mutations.</div>;
    }

    return (
        <Dialog open={open} onOpenChange={(newOpen) => !disabled && setOpen(newOpen)}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    disabled={isButtonDisabled}
                    className={isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    Cancelled
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Update Stock Mutation Status</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        value={formData.status}
                        onValueChange={(value: 'CANCELLED') =>
                            setFormData(prev => ({ ...prev, status: value }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {renderSelectOptions()}
                        </SelectContent>
                    </Select>

                    {formData.status === 'CANCELLED' && (
                        <Input
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            placeholder="Remarks (required for cancellation)"
                            required
                        />
                    )}

                    <Button
                        type="submit"
                        disabled={mutation.status === 'pending' || isButtonDisabled} // Disable button based on status
                        className="w-full bg-blue-600 text-white"
                    >
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
