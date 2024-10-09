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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Swal from 'sweetalert2';

const BASE_URL = 'http://localhost:8080/api';
// const api = axios.create({
//     baseURL: BASE_URL,
//     withCredentials: true,
// });

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
    status: 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
}

const UpdateStockMutationModal: React.FC<UpdateStockMutationModalProps> = ({ stockMutation, onUpdate, disabled }) => {
    const [open, setOpen] = useState(false);
    const getNextStatus = (currentStatus: string) => {
        switch (currentStatus) {
            case 'REQUESTED':
                return 'APPROVED';
            case 'APPROVED':
                return 'IN_TRANSIT';
            case 'IN_TRANSIT':
                return 'COMPLETED';
            default:
                return 'CANCELLED';
        }
    };
    const [formData, setFormData] = useState<StockMutationUpdateDto>({
        id: stockMutation.id,
        remarks: '',
        status: getNextStatus(stockMutation.status),
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { data: session } = useSession();
    const api = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${session?.user?.accessToken}`
        }
    });
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (updateData: StockMutationUpdateDto) => {
            if (!session) {
                throw new Error("Not authenticated");
            }
            return api.put('/stock-mutations/process', updateData);
        },
        onSuccess: () => {
            setOpen(false);
            onUpdate();
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Stock mutation status updated successfully!',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error: any) => {
            let errorMessage = 'An unexpected error occurred.';
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
                showConfirmButton: false
            });
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
        switch (stockMutation.status) {
            case 'REQUESTED':
                return (
                    <>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </>
                );
            case 'APPROVED':
                return (
                    <>
                        <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </>
                );
            case 'IN_TRANSIT':
                return (
                    <>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </>
                );
            default:
                return null;
        }
    };
    const isButtonDisabled = stockMutation.status === 'COMPLETED' || stockMutation.status === 'CANCELLED';

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
                    Proccess
                </Button>
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

                    <Button type="submit" disabled={mutation.status === 'pending'} className="w-full bg-blue-600 text-white">
                        {mutation.status === 'pending' ? 'Updating...' : 'Update Status'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateStockMutationModal;