'use client'
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import RoleDropdown from "./components/RoleDropdown"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import AddAdminForm from "./components/AddAdminForm"
import AdminTableSkeleton from "./components/AdminTableSkeleton"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading: boolean
  emailFilter: string
  setEmailFilter: (value: string) => void
  selectedRole: string | undefined
  setSelectedRole: (value: string | undefined) => void
  onDataChanged: () => void
  onPageChanged: (value: number) => void
}

export function DataTableAdmin<TData, TValue>({
  columns,
  data,
  loading,
  emailFilter,
  setEmailFilter,
  selectedRole,
  setSelectedRole,
  onDataChanged,
  onPageChanged
}: DataTableProps<TData, TValue>) {
  const [openNewAdminForm, setOpenNewAdminForm] = useState(false);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailFilter(event.target.value);
    onPageChanged(0);
  };

  const handleRoleChange = (city: string | undefined) => {
    setSelectedRole(city);
    onPageChanged(0);
  };


  const handleClose = () => {
    setOpenNewAdminForm(false);
  };

  return (
    <div>
      <div className="flex items-center py-4 gap-4 justify-between mb-5 flex-col lg:flex-row">
        <div className="flex gap-3 items-end">
          <h1 className="text-2xl font-bold">Admin List</h1>
        </div>
        <div className="flex items-center gap-4 lg:w-1/2">
          <div className="flex relative w-full">
            <Input
              placeholder="search email..."
              value={emailFilter}
              onChange={handleNameFilterChange}
              className="w-full pl-10"
            />
            <FaSearch className='size-4 absolute left-4 top-0 translate-y-3 text-gray-400' />
          </div>
          <RoleDropdown selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

          <Dialog open={openNewAdminForm} onOpenChange={setOpenNewAdminForm}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600  flex items-center gap-2"><PlusIcon size={20} /> Add New Admin </Button>
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogContent onInteractOutside={(e) => {
              e.preventDefault();
            }} className="max-w-sm lg:max-w-md">
              <AddAdminForm onClose={handleClose} onAdminAdded={onDataChanged} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {loading ? (
        <AdminTableSkeleton rowCount={5} />
      ) : (
        <div className="flex flex-col h-[26rem] overflow-hidden bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out mb-5">
          <Table>
            <TableHeader className="sticky-header bg-blue-600 hover:opacity-100 hover:bg-blue-600">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='bg-gradient-to-r from-blue-600 to-indigo-700 text-white' >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-white">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
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
      )}
    </div>
  )
}
