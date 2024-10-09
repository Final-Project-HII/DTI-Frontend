'use client'
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2, Edit, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';
import AddCategoryModal from './_components/AddCategoryModal';
import EditCategoryModal from './_components/EditCategoryModal';
import { Input } from "@/components/ui/input"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { FaSearch } from 'react-icons/fa';
import { DataTable } from './_components/DataTable';
import StockMutationTableSkeleton from '@/app/admin/stock/request/_components/StokMutationTableSkeleton';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types/category';

export default function CategoryManagementPage() {
    const { data: session, status } = useSession();
    const { categories, isPending, error, isLoading, deleteCategoryMutation } = useCategories();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const handleDeleteCategory = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed && session?.user?.accessToken) {
                deleteCategoryMutation.mutate({ id, token: session.user.accessToken });
            }
        });
    };

    const isSuperAdmin = session?.user?.role === 'SUPER';

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: "id",
            header: "No",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "categoryImage",
            header: "Image",
            cell: ({ row }) => (
                <div className="bg-white flex items-center justify-center p-1 w-14 h-14 rounded-xl shadow-md">
                    <Image
                        src={row.original.categoryImage
                            ? row.original.categoryImage.startsWith('http')
                                ? row.original.categoryImage
                                : `https://res.cloudinary.com/dcjjcs49e/image/upload/${row.original.categoryImage}`
                            : "/food.png"}
                        alt={row.original.name}
                        width={48}
                        height={48}
                        className="object-contain"
                    />
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "products",
            header: "Product Quantity",
            cell: ({ row }) => row.original.products.length,
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
        },
        {
            accessorKey: "updatedAt",
            header: "Updated At",
            cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
        },
        ...(isSuperAdmin ? [
            {
                id: "actions",
                accessorKey: "products",
                header: "Actions",
                cell: ({ row }: { row: { original: Category } }) => (
                    <div className="flex justify-center space-x-2">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setEditingCategory(row.original);
                                setIsEditModalOpen(true);
                            }}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => handleDeleteCategory(row.original.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                ),
            }
        ] : []),
    ];

    const table = useReactTable({
        data: categories || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (status === "unauthenticated") {
        return <div>Access Denied</div>
    }

    return (
        <div className="container mx-auto p-4 lg:pt-14">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-6">Category Management</h1>

                <div className="flex justify-end items-center mb-4 gap-4">
                    <div className="flex relative">
                        <Input
                            placeholder="Search categories..."
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm pl-10"
                        />
                        <FaSearch className='size-4 absolute left-4 top-0 translate-y-3 text-gray-400' />
                    </div>
                    {isSuperAdmin && (
                        <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    )}
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <StockMutationTableSkeleton rowCount={5} />
            ) : (
                <DataTable
                    columns={columns}
                    data={categories ?? []}
                    sorting={sorting}
                    setSorting={setSorting}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                />
            )}

            {isSuperAdmin && (
                <>
                    <AddCategoryModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        token={session?.user?.accessToken}
                    />

                    <EditCategoryModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setEditingCategory(null);
                        }}
                        category={editingCategory}
                        token={session?.user?.accessToken}
                    />
                </>
            )}
        </div>
    );
}