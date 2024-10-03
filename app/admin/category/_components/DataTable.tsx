import React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    SortingState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from './Pagination';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    sorting: SortingState
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>
    columnFilters: ColumnFiltersState
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
}

export function DataTable<TData, TValue>({
    columns,
    data,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <>
            <div className="flex flex-col h-[450px] overflow-hidden bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out mb-5">
                <Table>
                    <TableHeader className="sticky-header bg-blue-600 hover:opacity-100 hover:bg-blue-600">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className='bg-gradient-to-r from-blue-600 to-indigo-700 text-white'>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-center text-white">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className='text-center'
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination
                pageIndex={table.getState().pagination.pageIndex}
                pageSize={table.getState().pagination.pageSize}
                pageCount={table.getPageCount()}
                setPageIndex={table.setPageIndex}
                setPageSize={table.setPageSize}
                getCanPreviousPage={table.getCanPreviousPage}
                getCanNextPage={table.getCanNextPage}
                getRowModel={table.getRowModel}
                getCoreRowModel={table.getCoreRowModel}
            />
        </>
    );
}