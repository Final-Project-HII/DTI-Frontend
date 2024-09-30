'use client';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from './_components/DataTable';
import NewPagination from '../../warehouse/components/WarehouseTable/DataTable/components/Pagination';
import Image from 'next/image';
import StockMutationTableSkeleton from '../request/_components/StokMutationTableSkeleton';
import UpdateStockModal from './_components/UpdateStockModal';
import AddStockModal from './_components/AddStockModal';

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
    loginWarehouseId: string;
    price: number;
    weight: number;
    categoryId: string;
    categoryName: string;
}

interface StockResponse {
    statusCode: number;
    message: string;
    success: boolean;
    data: {
        content: StockItem[];
        totalPages: number | undefined;
        totalElements: number | undefined;
        size: number;
    };
}

interface RowInfo {
    row: {
        original: StockItem;
    };
}

const fetchStock = async (
    warehouseId?: string,
    token?: string,
    page: number = 0,
    size: number = 10
): Promise<StockResponse> => {
    const params = new URLSearchParams();
    if (warehouseId) {
        params.append('warehouseId', warehouseId);
    }
    params.append('page', String(page));
    params.append('size', String(size));

    const response = await axios.get<StockResponse>(`http://localhost:8080/api/stocks?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default function StockPage() {
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('2');
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const { data: session, status } = useSession();
    const isSuperAdmin = session?.user?.role === 'SUPER';
    const isAdmin = session?.user?.role === 'ADMIN';

    useEffect(() => {
        axios.get<{ data: { content: Warehouse[] } }>(`http://localhost:8080/api/warehouses`)
            .then(response => {
                setWarehouses(response.data.data.content);
            })
            .catch(error => console.error("Failed to fetch warehouses:", error));
    }, []);

    const { data, isLoading, error, refetch } = useQuery<StockResponse>({
        queryKey: ['stock', selectedWarehouse, currentPage, pageSize, session?.user?.accessToken],
        queryFn: () => fetchStock(selectedWarehouse, session?.user?.accessToken, currentPage, pageSize),
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


    const stockItems = data?.data.content ?? [];
    const hasData = stockItems.length > 0;

    const columns = useMemo(() => [
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
            accessorKey: 'quantity',
            header: 'Quantity',
        },
        {
            accessorKey: 'categoryName',
            header: 'Category',
        },
        {
            accessorKey: 'price',
            header: 'Price (IDR)',
            cell: (info: RowInfo) => (
                <span>Rp{info.row.original.price.toLocaleString()}</span>
            ),
        },
        {
            accessorKey: 'weight',
            header: 'Weight (g)',
            cell: (info: RowInfo) => (
                <span>{info.row.original.weight} g</span>
            ),
        },
        {
            accessorKey: 'updatedAt',
            header: 'Last Restock',
            cell: (info: RowInfo) => (
                <span>{new Date(info.row.original.updatedAt).toLocaleString()}</span>
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: (info: RowInfo) => (
                <UpdateStockModal
                    stockItem={info.row.original}
                    selectedWarehouse={selectedWarehouse}
                    onUpdate={() => refetch()}
                />
            ),
        },
    ], [selectedWarehouse, refetch]);
    if (error) return <div>Error loading stock data: {(error as Error).message}</div>;


    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Stock Management</h1>
            </div>
            <div className='mb-4 flex justify-between'>
                {isSuperAdmin && (
                    <select
                        id="warehouse-select"
                        value={selectedWarehouse}
                        onChange={handleWarehouseChange}
                        className="mb-4 p-2 border border-gray-300 rounded-md w-full max-w-xs"
                    >
                        <option value="">All Warehouses</option>
                        {warehouses.map((warehouse) => (
                            <option key={warehouse.id} value={warehouse.id.toString()}>
                                {warehouse.name}
                            </option>
                        ))}
                    </select>
                )}

                {isAdmin && selectedWarehouse && (
                    <div className='mb-4'>
                        <p>Selected Warehouse: {warehouses.find(w => w.id.toString() === selectedWarehouse)?.name}</p>
                    </div>
                )}
                <AddStockModal
                    warehouses={warehouses}
                    onAdd={() => refetch()}
                    selectedWarehouse={selectedWarehouse}
                />
            </div>

            {isLoading ? (
                <StockMutationTableSkeleton rowCount={5} />
            ) : (
                <div className="bg-white rounded-lg shadow-inner">
                    <DataTable
                        columns={columns}
                        data={stockItems}
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

            {hasData && (
                <NewPagination
                    currentPage={currentPage}
                    totalPages={data?.data.totalPages ?? 1}
                    pageSize={pageSize}
                    totalElements={data?.data.totalElements ?? 0}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}
        </div>
    );
}