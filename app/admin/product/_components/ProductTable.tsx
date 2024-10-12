'use client'
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";
import { formatDate } from 'date-fns';
import { useSession } from 'next-auth/react';
import { Product } from '@/types/product';

interface ProductTableProps {
    products: Product[];
    currentPage: number;
    pageSize: number;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    isLoading: boolean;
}

export function ProductTable({
    products,
    currentPage,
    pageSize,
    onEdit,
    onDelete,
    isLoading
}: ProductTableProps) {
    const { data: session, status } = useSession();
    const isSuperAdmin = session?.user?.role === 'SUPER';

    //first
    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "id",
            header: "No",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "productImages",
            header: "Image",
            cell: ({ row }) => (
                <div className="bg-white flex items-center justify-center p-1 w-14 h-14 rounded-xl shadow-md">
                    {row.original.productImages.length > 0 && (
                        <Image
                            src={row.original.productImages[0].imageUrl}
                            alt={row.original.name}
                            className={`w-12 h-12 object-contain rounded ${row.original.totalStock === 0 ? 'grayscale' : ''}`}
                            width={48}
                            height={48}
                        />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "weight",
            header: "Weight(gr)",
        },
        {
            accessorKey: "categoryName",
            header: "Category",
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => `Rp ${row.original.price.toLocaleString()}`,
        },
        {
            accessorKey: "createdAt",
            header: "Added Date",
            cell: ({ row }) => formatDate(new Date(row.original.createdAt), "dd MMM yyyy"),
        },
        ...(isSuperAdmin ? [{
            id: "actions",
            header: "Edit",
            cell: ({ row }: { row: { original: Product } }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem onClick={() => row.original.onEdit(row.original)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => row.original.onDelete(row.original.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        }] : []),
    ];
    //end

    const productsWithActions = products.map(product => ({
        ...product,
        onEdit,
        onDelete
    }));

    const table = useReactTable({
        data: productsWithActions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(products.length / pageSize),
    });


    return (
        <div className="flex flex-col h-[450px] overflow-hidden bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out">
            <Table>
                <TableHeader className="sticky-header bg-blue-600 hover:opacity-100 hover:bg-blue-600">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className='bg-gradient-to-r from-blue-600 to-indigo-700 text-white'>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="text-white">
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
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
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
    );
}