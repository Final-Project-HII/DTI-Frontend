'use client'
import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2, Edit, Plus, Upload } from 'lucide-react';
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

interface Category {
    id: number;
    name: string;
    categoryImage: string;
    products: number[];
    createdAt: string;
    updatedAt: string;
}

const BASE_URL = 'http://localhost:8080/api';

export default function CategoryManagementPage() {
    const queryClient = useQueryClient();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const fetchCategories = async (): Promise<Category[]> => {
        const response = await axios.get<Category[]>(`${BASE_URL}/category`);
        return response.data;
    };

    const { data: categories, isPending, error } = useQuery<Category[], Error>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`${BASE_URL}/category/delete/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    const handleDeleteCategory = (id: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategoryMutation.mutate(id);
        }
    };

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
                        src={row.original.categoryImage ? row.original.categoryImage.startsWith('http') ? row.original.categoryImage : `https://res.cloudinary.com/dcjjcs49e/image/upload/${row.original.categoryImage}` : "/food.png"}
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
        {
            id: "actions",
            accessorKey: "products",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center space-x-2">
                    <Button variant="ghost" onClick={() => {
                        setEditingCategory(row.original);
                        setIsEditModalOpen(true);
                    }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="ghost" onClick={() => handleDeleteCategory(row.original.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            ),
        },
    ]


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
                    <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                </div>
            </div>


            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}

            {isPending ? (
                <div>Loading...</div>
            ) : categories ? (
                <DataTable
                    columns={columns}
                    data={categories}
                    sorting={sorting}
                    setSorting={setSorting}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                />
            ) : null}

            <AddCategoryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <EditCategoryModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingCategory(null);
                }}
                category={editingCategory}
            />

            {deleteCategoryMutation.isError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{deleteCategoryMutation.error?.message}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}