'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/app/admin/stock/request/_components/StockMutationTable';
import NewPagination from '../../warehouse/components/WarehouseTable/DataTable/components/Pagination';
import StockMutationTableSkeleton from '@/app/admin/stock/request/_components/StokMutationTableSkeleton';
import { ColumnDef } from '@tanstack/react-table';
import { DateMutationTypeFilter } from './_component/DateFilter';
import { DateRange } from "react-day-picker";
import { MonthYearPicker } from '@/components/ui/date-picker';
import { SummaryCard } from './_component/SummaryCard';
import { fetchStockMutationJournals, fetchStockReport, fetchWarehouses } from '@/hooks/useStockMutation';
import { Warehouse, StockMutationJournal, StockMutationJournalResponse, ProductSummary, StockReportResponse } from '@/types/stockMutation';

export default function StockMutationJournalPage() {
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('2');
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [productSummaryPage, setProductSummaryPage] = useState(0);
    const [productSummaryPageSize, setProductSummaryPageSize] = useState(50);
    const [pageSize, setPageSize] = useState<number>(5);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2024, 8));
    const [mutationType, setMutationType] = useState<string>('');
    const { data: session, status } = useSession();
    const isSuperAdmin = session?.user?.role === 'SUPER';
    const isAdmin = session?.user?.role === 'ADMIN';

    useEffect(() => {
        fetchWarehouses()
            .then(setWarehouses)
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

    const { data: reportData, isLoading: reportLoading, error: reportError } = useQuery<StockReportResponse>({
        queryKey: ['stock-report', selectedWarehouse, selectedDate, productSummaryPage, productSummaryPageSize],
        queryFn: () => fetchStockReport(
            session?.user?.accessToken!,
            selectedWarehouse,
            selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}` : '',
            productSummaryPage,
            productSummaryPageSize
        ),
        enabled: !!session?.user?.accessToken && !!selectedDate,
    });

    useEffect(() => {
        if (isAdmin && data?.data?.content && data.data.content.length > 0) {
            const loginWarehouseId = data.data.content[0].loginWarehouseId;
            if (loginWarehouseId !== undefined) {
                setSelectedWarehouse(loginWarehouseId.toString());
            }
        }
    }, [isAdmin, data]);

    const handleProductSummaryPageChange = (newPage: number) => {
        setProductSummaryPage(newPage);
    };

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

    const productSummaryColumns: ColumnDef<ProductSummary>[] = useMemo(
        () => [
            { accessorKey: 'productId', header: 'Product ID' },
            { accessorKey: 'productName', header: 'Product Name' },
            { accessorKey: 'totalAddition', header: 'Total Addition' },
            { accessorKey: 'totalReduction', header: 'Total Reduction' },
            { accessorKey: 'endingStock', header: 'Ending Stock' },
        ],
        []
    );

    const columns: ColumnDef<StockMutationJournal>[] = useMemo(
        () => [
            { accessorKey: 'uuid', header: 'UUID' },
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

    const stockInTotal = reportData?.summary.totalAddition || 0;
    const stockOutTotal = reportData?.summary.totalReduction || 0;
    const totalStock = reportData?.summary.endingStock || 0;
    const stockInPercentage = totalStock > 0 ? (stockInTotal / totalStock) * 100 : 0;
    const stockOutPercentage = totalStock > 0 ? (stockOutTotal / totalStock) * 100 : 0;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Stock Report</h1>
            <div className='flex justify-end gap-4'>
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
                        <p>Selected Warehouse: {warehouses.find(w => w.id.toString() === selectedWarehouse)?.name}</p>
                    </div>
                )}
                <div className='mb-4'>
                    <MonthYearPicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date as Date | undefined)}
                        dateFormat="yyyy-MM"
                    />
                </div>
            </div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <SummaryCard
                    title="Stock In"
                    value={stockInTotal}
                    percentage={stockInPercentage}
                    isPositive={true}
                />
                <SummaryCard
                    title="Stock Out"
                    value={stockOutTotal}
                    percentage={stockOutPercentage}
                    isPositive={false}
                />
                <SummaryCard
                    title="Total Stock"
                    value={totalStock}
                    showPercentage={false}
                />
            </div>
            <div className="my-4">

                <h2 className="text-xl font-semibold my-4">Product Summary</h2>
                {reportLoading ? (
                    <div className="my-4"><StockMutationTableSkeleton rowCount={5} /></div>
                ) : reportData && reportData.summary && reportData.summary.productSummaries ? (
                    <>
                        <DataTable
                            columns={productSummaryColumns}
                            data={reportData.summary.productSummaries.content || []}
                            loading={reportLoading}
                            nameFilter=""
                            setNameFilter={() => { }}
                            selectedCity={undefined}
                            setSelectedCity={() => { }}
                            onDataChanged={() => { }}
                            onPageChanged={handlePageChange}
                        />
                        <NewPagination
                            currentPage={productSummaryPage}
                            totalPages={reportData.summary.productSummaries.totalPages}
                            pageSize={productSummaryPageSize}
                            totalElements={reportData.summary.productSummaries.totalElements}
                            onPageChange={handleProductSummaryPageChange}
                            onPageSizeChange={setProductSummaryPageSize}
                        />
                    </>
                ) : (
                    <div>No product summary data available</div>
                )}
            </div>
            {/* rnd report */}
            <div className="my-4 flex justify-between mt-10">
                <h2 className="text-xl font-semibold my-4">Stock Mutation Journal</h2>
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