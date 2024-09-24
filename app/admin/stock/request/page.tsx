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
import CreateStockMutationModal from './_components/StockMutationModal';
import UpdateStockMutationModal from './_components/UpdateStockMutationModal';
import { useSession } from 'next-auth/react';

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

const fetchStockMutations = async (destinationWarehouseId?: string, token?: string): Promise<ApiResponse> => {
    const params = new URLSearchParams();
    if (destinationWarehouseId) {
        params.append('destinationWarehouseId', destinationWarehouseId);
    }
    const response = await axios.get(`http://localhost:8080/api/stock-mutations?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'REQUESTED':
            return <Badge className="bg-yellow-100 text-yellow-600"> Requested</Badge>;
        case 'APPROVED':
            return <Badge className="bg-green-100 text-green-700"> Approved</Badge>;
        case 'COMPLETED':
            return <Badge className="bg-blue-100 text-blue-700"> Completed</Badge>;
        case 'IN_TRANSIT':
            return <Badge className="bg-violet-100 text-violet-700"> In_Transit</Badge>;
        case 'CANCELLED':
            return <Badge className="bg-red-100 text-red-700"> Cancelled</Badge>;
        default:
            return <Badge className="bg-gray-100 text-gray-700"> Unknown</Badge>;
    }
};

export default function StockMutationPage() {
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const { data: session } = useSession();

    //fetch all
    useEffect(() => {
<<<<<<< HEAD
        const fetchWarehouses = async () => {
            try {
                // const response = await axios.get('http://localhost:8080/api/warehouses');
                const response = await axios.get('http://localhost:8080/api/warehouses', {
                    headers: {
                        Authorization: `Bearer ${session?.user?.accessToken}`,
                    },
                });

                setWarehouses(response.data.data.content);
            } catch (error) {
                console.error('Error fetching warehouses:', error);
            }
        };
        if (session?.user?.accessToken) {
            fetchWarehouses();
        }
    }, [session]);
=======
        // Fetch warehouses
        axios.get<{
            data: {
                content: Warehouse[];
            };
        }>(`http://localhost:8080/api/warehouses`)
            .then(response => {
                setWarehouses(response.data.data.content);
            })
            .catch(error => console.error("Failed to fetch warehouses:", error));
    }, []);

>>>>>>> f59e7652a9e50590018d4b621cd077e84ce93e09

    const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
        queryKey: ['stockMutations', selectedWarehouse, session?.user?.accessToken],
        queryFn: () => fetchStockMutations(selectedWarehouse, session?.user?.accessToken),
        enabled: !!session?.user?.accessToken,
    });
    if (!session) {
        return <div>Please log in to view stock mutations.</div>;
    }

    const handleWarehouseChange = (value: string) => {
        setSelectedWarehouse(value === 'All Warehouses' ? '' : value);
        refetch();
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {(error as Error).message}</div>;

    return (
        <div className="container mx-auto py-10">
            <div className='flex gap-3 justify-between items-center'>
                <h1 className="text-2xl font-bold mb-4">Stock Mutation Request</h1>
                <div className='flex gap-3 mb-4'>
                    {/* <p className='text-sm items-center'>Select Origin Warehouse</p> */}
                    {/* <p className='text-sm items-center'>Select Destination Warehouse</p> */}
                    <WarehouseSelect
                        value={selectedWarehouse}
                        onChange={handleWarehouseChange}
                        warehouses={warehouses}
                        placeholder="All Warehouses"
                    />
                    <CreateStockMutationModal warehouses={warehouses} refetchMutations={refetch} />
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className='bg-blue-600 text-white'>
                        <TableHead className='text-white'>Image</TableHead>
                        <TableHead className='text-white'>Product Name</TableHead>
                        {/* origin warehouse */}
                        <TableHead className='text-white'>Requested To</TableHead>
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
                                {/* {new Date(mutation.createdAt).toLocaleString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    // hour: '2-digit',
                                    // minute: '2-digit',
                                })} */}
                                {mutation.createdAt.slice(0, 4)}/{mutation.createdAt.slice(5, 7)}/{mutation.createdAt.slice(8, 10)}
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