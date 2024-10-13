'use client';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from './_components/StockMutationTable';
import NewPagination from '../../warehouse/components/WarehouseTable/DataTable/components/Pagination';
import Image from 'next/image';
import StockMutationTableSkeleton from '../request/_components/StokMutationTableSkeleton';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import UpdateStockMutationModal from './_components/UpdateStockReq';
import CreateStockMutationModal from './_components/StockMutationModal';
import RemarkButton from './_components/RemarkButton';


interface Warehouse {
    id: number;
    name: string;
    addressLine: string;
    city: {
        id: number;
        name: string;
    };
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
    status: 'COMPLETED' | 'REQUESTED' | 'IN_TRANSIT' | 'CANCELLED' | 'APPROVED';
    loginWarehouseId: number;
    mutationType: 'MANUAL';
    remarks: string | null;
    requestedBy: string;
    handledBy: string | null;
    createdAt: string;
    updatedAt: string;
}

interface StockMutationResponse {
    statusCode: number;
    message: string;
    success: boolean;
    data: {
        content: StockMutation[];
        totalPages: number | undefined;
        totalElements: number | undefined;
        size: number;
    };
}

interface RowInfo {
    row: {
        original: {
            id: number;
            productId: number;
            productName: string;
            productImageUrl: string;
            originWarehouseId: number;
            originWarehouseName: string;
            destinationWarehouseId: number;
            destinationWarehouseName: string;
            quantity: number;
            status: 'COMPLETED' | 'REQUESTED' | 'IN_TRANSIT' | 'CANCELLED' | 'APPROVED';
            loginWarehouseId: number;
            mutationType: 'MANUAL';
            remarks: string | null;
            requestedBy: string;
            handledBy: string | null;
            createdAt: string;
            updatedAt: string;
        };
    };
}
// const BASE_URL = 'http://localhost:8080/api';
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;

const fetchStockMutations = async (
    // originWarehouseId?: string,
    destinationWarehouseId?: string,
    token?: string,
    page: number = 0,
    size: number = 10
): Promise<StockMutationResponse> => {
    const params = new URLSearchParams();
    // if (originWarehouseId) {
    //     params.append('originWarehouseId', originWarehouseId);
    // }
    if (destinationWarehouseId) {
        params.append('destinationWarehouseId', destinationWarehouseId); // Filter berdasarkan destination
    }
    params.append('page', String(page));
    params.append('size', String(size));

    const response = await axios.get<StockMutationResponse>(`${BASE_URL}/stock-mutations?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
const fetchWarehouses = async (token: string): Promise<Warehouse[]> => {
    const response = await axios.get<{ data: { content: Warehouse[] } }>(`${BASE_URL}/warehouses`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data.content;
};

export default function StockMutationPage() {
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('1');
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const { data: session, status } = useSession();
    const isSuperAdmin = session?.user?.role === 'SUPER';
    const isAdmin = session?.user?.role === 'ADMIN';

    useEffect(() => {
        if (session?.user?.accessToken) {
            fetchWarehouses(session.user.accessToken)
                .then(setWarehouses)
                .catch(error => console.error("Failed to fetch warehouses:", error));
        }
    }, [session?.user?.accessToken]);

    const { data, isLoading, error, refetch } = useQuery<StockMutationResponse>({
        queryKey: ['stock-mutations', selectedWarehouse, currentPage, pageSize, session?.user?.accessToken],
        queryFn: () => fetchStockMutations(selectedWarehouse, session?.user?.accessToken, currentPage, pageSize),
        enabled: !!session?.user?.accessToken,
    });
    useEffect(() => {
        if (isAdmin && data?.data?.content && data.data.content.length > 0) {
            const loginWarehouseId = data.data.content[0].loginWarehouseId;
            if (loginWarehouseId !== undefined) {
                setSelectedWarehouse(loginWarehouseId.toString());
            }
        }
    }, [isAdmin, data]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };
    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(0);
        refetch();
    };

    const handleWarehouseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWarehouse(event.target.value);
        setCurrentPage(0);
    };

    const stockMutations = data?.data.content ?? [];
    const hasData = stockMutations.length > 0;

    const columns: ColumnDef<StockMutation, any>[] = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
            },
            {
                accessorKey: 'productImageUrl',
                header: 'Image',
                cell: (info: RowInfo) => (
                    <Image
                        src={info.row.original.productImageUrl}
                        alt={info.row.original.productName}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                    />
                )
            },
            {
                accessorKey: 'productName',
                header: 'Product Name',
            },
            {
                accessorKey: 'originWarehouseName',
                header: 'Origin Warehouse',
            },
            // {
            //     accessorKey: 'destinationWarehouseName',
            //     header: 'Destination Warehouse',
            // },
            {
                accessorKey: 'quantity',
                header: 'Quantity',
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: (info: RowInfo) => {
                    const status = info.row.original.status;
                    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";

                    switch (status) {
                        case 'REQUESTED':
                            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Requested</span>;
                        case 'APPROVED':
                            return <span className={`${baseClasses} bg-green-100 text-green-800`}>Approved</span>;
                        case 'COMPLETED':
                            return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Completed</span>;
                        case 'IN_TRANSIT':
                            return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>In Transit</span>;
                        case 'CANCELLED':
                            return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
                        default:
                            return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</span>;
                    }
                },
            },
            {
                accessorKey: 'handledBy',
                header: 'Handled By',
            },
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                cell: (info: RowInfo) => (
                    <span>{new Date(info.row.original.createdAt).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'updatedAt',
                header: 'Updated At',
                cell: (info: RowInfo) => (
                    <span>{new Date(info.row.original.updatedAt).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                cell: (info: RowInfo) => {
                    const { status } = info.row.original;
                    const isDisabled = status !== 'REQUESTED';

                    return (
                        <UpdateStockMutationModal
                            stockMutation={info.row.original}
                            onUpdate={() => refetch()}
                            disabled={isDisabled}
                        />
                    );
                },
            },
            {
                accessorKey: 'remarks',
                header: 'Remark',
                cell: (info: RowInfo) => (
                    <RemarkButton
                        remarks={info.row.original.remarks}
                        status={info.row.original.status}
                    />
                ),
            },

        ],
        []
    );

    if (error) return <div>Error loading stock mutation data: {(error as Error).message}</div>;
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Stock Mutation Request</h1>

            {/* <label htmlFor="warehouse-select" className="block mb-2 font-medium">
                Select Warehouse:
            </label> */}
            <div className='mb-4 flex justify-between'>
                <div>
                    {isSuperAdmin && (
                        <select
                            id="warehouse-select"
                            value={selectedWarehouse}
                            onChange={handleWarehouseChange}
                            className="mb-4 p-2 border border-gray-300 rounded-md w-full max-w-xs"
                        >
                            <option value="">All Warehouses</option>
                            {warehouses.map((warehouse) => (
                                <option key={warehouse.id} value={warehouse.id}>
                                    {warehouse.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <CreateStockMutationModal warehouses={warehouses} selectedWarehouse={selectedWarehouse} refetchMutations={refetch} />
            </div>
            {isAdmin && selectedWarehouse && (
                <div className='mb-4'>
                    {/* <p>Selected Warehouse: {warehouses.find(w => w.id.toString() === selectedWarehouse)?.name}</p> */}
                </div>
            )}
            {isLoading ? (
                <StockMutationTableSkeleton rowCount={5} />
            ) : (
                <div className="bg-white rounded-lg shadow-inner">
                    <DataTable
                        columns={columns}
                        data={stockMutations}
                        loading={isLoading}
                        nameFilter=""
                        setNameFilter={() => { }}
                        selectedCity={undefined}
                        setSelectedCity={() => { }}
                        onDataChanged={() => { }}
                        onPageChanged={handlePageChange}
                    />
                </div>
            )}

            {/* Pagination Controls */}
            {hasData && (
                // <div className="flex justify-between w-full mt-4">
                <NewPagination
                    currentPage={currentPage}
                    totalPages={data?.data.totalPages ?? 1}
                    pageSize={pageSize}
                    totalElements={data?.data.totalElements ?? 0}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
                // </div>
            )}
        </div>
    );
}