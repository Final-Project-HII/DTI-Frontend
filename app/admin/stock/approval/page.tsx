'use client';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import WarehouseSelect from '../management/_components/WarehouseSelect';
import Image from 'next/image';
import CreateStockMutationModal from '../request/_components/StockMutationModal';
import UpdateStockMutationModal from '../request/_components/UpdateStockMutationModal';

interface StockMutation {
    id: number;
    productName: string;
    productId: number;
    productImageUrl: string;
    originWarehouseId: number;
    originWarehouseName: string;
    destinationWarehouseId: number;
    destinationWarehouseName: string;
    quantity: number;
    requestedBy: string;
    handledBy: string;
    createdAt: string;
    status: 'REQUESTED' | 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
    mutationType: 'MANUAL' | 'AUTOMATIC';
    remarks: string | null;
}

interface ApiResponse {
    data: {
        content: StockMutation[];
    };
}

interface Warehouse {
    id: number;
    name: string;
}

const fetchStockMutations = async (destinationWarehouseId?: string): Promise<ApiResponse> => {
    const params = new URLSearchParams();
    if (destinationWarehouseId) {
        params.append('destinationWarehouseId', destinationWarehouseId);
    }
    const response = await axios.get(`http://localhost:8080/api/stock-mutations?${params.toString()}`);
    return response.data;
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'REQUESTED':
            return <Badge className="bg-yellow-100 text-yellow-600"> •Requested</Badge>;
        case 'APPROVED':
            return <Badge className="bg-green-100 text-green-700"> •Approved</Badge>;
        case 'COMPLETED':
            return <Badge className="bg-blue-100 text-blue-700"> •Completed</Badge>;
        case 'REJECTED':
            return <Badge className="bg-violet-100 text-violet-700"> •In_Transit</Badge>;
        case 'CANCELLED':
            return <Badge className="bg-red-100 text-red-700"> •Cancelled</Badge>;
        default:
            return <Badge className="bg-gray-100 text-gray-700"> •Unknown</Badge>;
    }
};

export default function StockMutationPage() {
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/warehouses');
                setWarehouses(response.data.data);
            } catch (error) {
                console.error('Error fetching warehouses:', error);
            }
        };
        fetchWarehouses();
    }, []);

    const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
        queryKey: ['stockMutations', selectedWarehouse],
        queryFn: () => fetchStockMutations(selectedWarehouse),
    });

    const handleWarehouseChange = (value: string) => {
        setSelectedWarehouse(value);
        refetch();
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {(error as Error).message}</div>;

    return (
        <div className="container mx-auto py-10">
            <div className='flex gap-3 justify-between items-center'>
                <h1 className="text-2xl font-bold mb-4">Stock Mutation Approval</h1>
                <div className='flex gap-3 mb-4'>
                    <p className='text-sm items-center'>Select Destination Warehouse</p>
                    <WarehouseSelect
                        value={selectedWarehouse}
                        onChange={handleWarehouseChange}
                        warehouses={warehouses}
                        placeholder="Select Destination Warehouse"
                    />
                    {/* <CreateStockMutationModal warehouses={warehouses} refetchMutations={refetch} /> */}
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className='bg-blue-600 text-white'>
                        <TableHead className='text-white'>Image</TableHead>
                        <TableHead className='text-white'>Product Name</TableHead>
                        <TableHead className='text-white'>Origin Warehouse</TableHead>
                        <TableHead className='text-white'>Quantity</TableHead>
                        <TableHead className='text-white'>Status</TableHead>
                        <TableHead className='text-white'>Type</TableHead>
                        <TableHead className='text-white'>Handled By</TableHead>
                        <TableHead className='text-white'>Created At</TableHead>
                        <TableHead className='text-white'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data.content.map((mutation) => (
                        <TableRow key={mutation.id}>
                            <TableCell>
                                <div className="bg-white flex items-center justify-center p-2 w-14 h-14 rounded-xl shadow-md">
                                    <Image
                                        src={mutation.productImageUrl}
                                        alt={mutation.productName}
                                        className={`w-12 h-12 object-contain rounded ${mutation.quantity === 0 ? 'grayscale' : ''}`}
                                        width={48}
                                        height={48}
                                    />
                                </div>
                            </TableCell>
                            <TableCell>{mutation.productName}</TableCell>
                            <TableCell>{mutation.originWarehouseName}</TableCell>
                            <TableCell>{mutation.quantity}</TableCell>
                            <TableCell>{getStatusBadge(mutation.status)}</TableCell>
                            <TableCell>{mutation.mutationType}</TableCell>
                            <TableCell>{mutation.handledBy}</TableCell>
                            <TableCell>
                                {new Date(mutation.createdAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: '2-digit',
                                })}
                            </TableCell>
                            <TableCell>
                                <UpdateStockMutationModal
                                    stockMutation={mutation}
                                    onUpdate={refetch}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}