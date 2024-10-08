'use client';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/app/admin/stock/request/_components/StockMutationTable';
import NewPagination from '../../warehouse/components/WarehouseTable/DataTable/components/Pagination';
import StockMutationTableSkeleton from '@/app/admin/stock/request/_components/StokMutationTableSkeleton';
import { ColumnDef } from '@tanstack/react-table';
import { MonthYearPicker } from '@/components/ui/date-picker';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import { SummaryCard } from './_components/SummaryCard';
// import { useSalesReport } from '@/hooks/useSalesReport';

import { SalesSummary, CategorySales, ProductSales, SalesDetail, SummaryCardProps, ApiResponse, Warehouse } from '@/types/salesReport';

import { useSalesReport } from '@/hooks/useSalesReport';

export default function SalesReportPage() {
  const {
    selectedWarehouse,
    setSelectedWarehouse,
    warehouses,
    selectedDate,
    setSelectedDate,
    categorySalesPage,
    setCategorySalesPage,
    productSalesPage,
    setProductSalesPage,
    salesDetailsPage,
    setSalesDetailsPage,
    pageSize,
    setPageSize,
    summaryQuery,
    categorySalesQuery,
    productSalesQuery,
    salesDetailsQuery,
    session,
  } = useSalesReport();

  const isSuperAdmin = session?.user?.role === 'SUPER';
  const isAdmin = session?.user?.role === 'ADMIN';

  const handleWarehouseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWarehouse(event.target.value);
  };

  const categorySalesColumns: ColumnDef<CategorySales>[] = useMemo(
    () => [
      { accessorKey: 'categoryName', header: 'Category Name' },
      { accessorKey: 'totalGrossRevenue', header: 'Total Gross Revenue' },
      { accessorKey: 'totalOrders', header: 'Total Orders' },
    ],
    []
  );

  const productSalesColumns: ColumnDef<ProductSales>[] = useMemo(
    () => [
      { accessorKey: 'productName', header: 'Product Name' },
      { accessorKey: 'categoryName', header: 'Category Name' },
      { accessorKey: 'totalGrossRevenue', header: 'Total Gross Revenue' },
      { accessorKey: 'totalQuantity', header: 'Total Quantity' },
      { accessorKey: 'productPrice', header: 'Product Price' },
    ],
    []
  );

  const salesDetailsColumns: ColumnDef<SalesDetail>[] = useMemo(
    () => [
      { accessorKey: 'invoiceId', header: 'Invoice ID' },
      { accessorKey: 'orderDate', header: 'Order Date' },
      { accessorKey: 'originalAmount', header: 'Original Amount' },
      { accessorKey: 'totalQuantity', header: 'Total Quantity' },
      { accessorKey: 'status', header: 'Status' },
    ],
    []
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Report</h1>
      <div className='flex justify-end gap-4 mb-4'>
        {isSuperAdmin && (
          <select
            id="warehouse-select"
            value={selectedWarehouse}
            onChange={handleWarehouseChange}
            className="p-2 border border-gray-300 rounded-md w-full max-w-xs"
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
        <MonthYearPicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date as Date | undefined)}
          dateFormat="yyyy-MM"
        />
      </div>

      {/* Summary Cards */}
      {summaryQuery.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-200 rounded-lg p-4">
            <div className="h-4 w-full bg-gray-300 rounded-full"></div>
          </div>
          <div className="bg-gray-200 rounded-lg p-4">
            <div className="h-4 w-full bg-gray-300 rounded-full"></div>
          </div>
        </div>
      ) : summaryQuery.data && summaryQuery.data.data.content[0] && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <SummaryCard
            title="Total Gross Revenue"
            value={Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(summaryQuery.data.data.content[0].totalGrossRevenue)}
            showPercentage={false}
          />
          <SummaryCard
            title="Total Orders"
            value={summaryQuery.data.data.content[0].totalOrders}
            showPercentage={false}
          />
        </div>
      )}

      {/* Category Sales Table */}
      <h2 className="text-xl font-semibold my-4">Category Sales</h2>
      {categorySalesQuery.isLoading ? (
        <StockMutationTableSkeleton rowCount={5} />
      ) : categorySalesQuery.data && (
        <>
          <DataTable
            columns={categorySalesColumns}
            data={categorySalesQuery.data.data.content}
            loading={categorySalesQuery.isLoading}
            nameFilter=""
            setNameFilter={() => { }}
            selectedCity={undefined}
            setSelectedCity={() => { }}
            onDataChanged={() => { }}
            onPageChanged={(page) => setCategorySalesPage(page)}
          />
          <NewPagination
            currentPage={categorySalesPage}
            totalPages={categorySalesQuery.data.data.totalPages}
            pageSize={pageSize}
            totalElements={categorySalesQuery.data.data.totalElements}
            onPageChange={(page) => setCategorySalesPage(page)}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {/* Product Sales Table */}
      <h2 className="text-xl font-semibold my-4">Product Sales</h2>
      {productSalesQuery.isLoading ? (
        <StockMutationTableSkeleton rowCount={5} />
      ) : productSalesQuery.data && (
        <>
          <DataTable
            columns={productSalesColumns}
            data={productSalesQuery.data.data.content}
            loading={productSalesQuery.isLoading}
            nameFilter=""
            setNameFilter={() => { }}
            selectedCity={undefined}
            setSelectedCity={() => { }}
            onDataChanged={() => { }}
            onPageChanged={(page) => setProductSalesPage(page)}
          />
          <NewPagination
            currentPage={productSalesPage}
            totalPages={productSalesQuery.data.data.totalPages}
            pageSize={pageSize}
            totalElements={productSalesQuery.data.data.totalElements}
            onPageChange={(page) => setProductSalesPage(page)}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {/* Sales Details Table */}
      <h2 className="text-xl font-semibold my-4">Sales Details</h2>
      {salesDetailsQuery.isLoading ? (
        <StockMutationTableSkeleton rowCount={5} />
      ) : salesDetailsQuery.data && (
        <>
          <DataTable
            columns={salesDetailsColumns}
            data={salesDetailsQuery.data.data.content}
            loading={salesDetailsQuery.isLoading}
            nameFilter=""
            setNameFilter={() => { }}
            selectedCity={undefined}
            setSelectedCity={() => { }}
            onDataChanged={() => { }}
            onPageChanged={(page) => setSalesDetailsPage(page)}
          />
          <NewPagination
            currentPage={salesDetailsPage}
            totalPages={salesDetailsQuery.data.data.totalPages}
            pageSize={pageSize}
            totalElements={salesDetailsQuery.data.data.totalElements}
            onPageChange={(page) => setSalesDetailsPage(page)}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </div>
  );
}