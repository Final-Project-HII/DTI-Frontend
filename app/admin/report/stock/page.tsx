'use client';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/app/admin/stock/request/_components/StockMutationTable';
import NewPagination from '../../warehouse/components/WarehouseTable/DataTable/components/Pagination';
import StockMutationTableSkeleton from '@/app/admin/stock/request/_components/StokMutationTableSkeleton';
import { ColumnDef } from '@tanstack/react-table';
import { DateMutationTypeFilter } from './_component/DateFilter';
import { DateRange } from "react-day-picker"

interface Warehouse {
    id: number;
    name: string;
}

interface StockMutationJournal {
    id: number;
    stockMutationId: number;
    productName: string;
    warehouseName: string;
    anotherWarehouse: string;
    beginningStock: number;
    endingStock: number;
    mutationType: 'IN' | 'OUT';
    quantity: number;
    createdAt: string;
    uuid: number;
    loginWarehouseId: number;
}

interface StockMutationJournalResponse {
    statusCode: number;
    message: string;
    success: boolean;
    data: {
        content: StockMutationJournal[];
        totalPages: number;
        totalElements: number;
        size: number;
        number: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        first: boolean;
        last: boolean;
        numberOfElements: number;
        pageable: {
            pageNumber: number;
            pageSize: number;
            sort: {
                empty: boolean;
                sorted: boolean;
                unsorted: boolean;
            };
            offset: number;
            paged: boolean;
            unpaged: boolean;
        };
        empty: boolean;
    };
}

const fetchStockMutationJournals = async (
    token?: string,
    warehouseId?: string,
    productName?: string,
    mutationType?: 'IN' | 'OUT',
    startDate?: string,
    endDate?: string,
    page: number = 0,
    size: number = 20
): Promise<StockMutationJournalResponse> => {
    const params = new URLSearchParams();
    if (warehouseId) params.append('warehouseId', warehouseId);
    if (productName) params.append('productName', productName);
    if (mutationType) params.append('mutationType', mutationType);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('page', String(page));
    params.append('size', String(size));

    const response = await axios.get<StockMutationJournalResponse>(
        `http://localhost:8080/api/stock-mutations/journal?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export default function StockMutationJournalPage() {
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('2');
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [mutationType, setMutationType] = useState<string>('');
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

    const { data, isLoading, error, refetch } = useQuery<StockMutationJournalResponse>({
        queryKey: ['stock-mutation-journals', selectedWarehouse, currentPage, pageSize, session?.user?.accessToken, dateRange, mutationType],
        queryFn: () => fetchStockMutationJournals(
            session?.user?.accessToken,
            selectedWarehouse,
            undefined,
            mutationType as 'IN' | 'OUT' | undefined,
            dateRange?.from?.toISOString(),
            dateRange?.to?.toISOString(),
            currentPage,
            pageSize
        ),
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
    };

    const handleWarehouseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWarehouse(event.target.value);
        setCurrentPage(0);
    };

    const handleApplyFilter = () => {
        setCurrentPage(0);
        refetch();
    };

    const stockMutationJournals = data?.data.content ?? [];
    const hasData = stockMutationJournals.length > 0;
    // { accessorKey: 'beginningStock', header: 'Beginning Stock' },
    // { accessorKey: 'endingStock', header: 'Ending Stock' },
    const columns: ColumnDef<StockMutationJournal>[] = useMemo(
        () => [
            // { accessorKey: 'id', header: 'ID' },
            { accessorKey: 'uuid', header: 'UUID' },
            // { accessorKey: 'stockMutationId', header: 'Stock Mutation ID' },
            { accessorKey: 'productName', header: 'Product Name' },
            { accessorKey: 'warehouseName', header: 'Warehouse In' },
            { accessorKey: 'anotherWarehouse', header: 'Warehouse Out' },
            { accessorKey: 'mutationType', header: 'Mutation Type' },
            { accessorKey: 'quantity', header: 'Quantity' },
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
            },
        ],
        []
    );

    if (error) return <div>Error loading stock mutation journal data: {(error as Error).message}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Stock Mutation Journal</h1>
            <div className='flex justify-between'>
                <div className='mb-4'>
                    {/* <label htmlFor="warehouse-select" className="block mb-2 font-medium">
                    Select Warehouse:
                </label> */}
                    {isSuperAdmin && (
                        <div className='mb-4 flex justify-between'>
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
                        </div>
                    )}

                    {isAdmin && selectedWarehouse && (
                        <div className='mb-4'>
                            {/* <p>Selected Warehouse: {warehouses.find(w => w.id.toString() === selectedWarehouse)?.name}</p> */}
                        </div>
                    )}
                </div>

                <DateMutationTypeFilter
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    mutationType={mutationType}
                    setMutationType={setMutationType}
                    onApplyFilter={handleApplyFilter}
                />
            </div>

            {isLoading ? (
                <StockMutationTableSkeleton rowCount={5} />
            ) : (
                <div className="bg-white rounded-lg shadow-inner">
                    <DataTable
                        columns={columns}
                        data={stockMutationJournals}
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
                <div className="flex justify-end items-center mt-4">
                    <NewPagination
                        currentPage={currentPage}
                        totalPages={data?.data.totalPages ?? 1}
                        pageSize={pageSize}
                        totalElements={data?.data.totalElements ?? 0}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </div>
            )}
        </div>
    );
}