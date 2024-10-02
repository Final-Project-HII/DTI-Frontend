'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { PlusIcon } from "lucide-react"
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import AddWarehouseForm from "../../AddWarehoseForm"
import CityComboBox from "./components/CityComboBox"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading: boolean
  nameFilter: string
  setNameFilter: (value: string) => void
  selectedCity: string | undefined
  setSelectedCity: (value: string | undefined) => void
  onDataChanged: () => void
  onPageChanged: (value: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  nameFilter,
  setNameFilter,
  selectedCity,
  setSelectedCity,
  onDataChanged,
  onPageChanged
}: DataTableProps<TData, TValue>) {
  const [openNewWarehouseForm, setOpenNewWarehouseForm] = useState(false);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(event.target.value);
    onPageChanged(0);
  };

  const handleCityChange = (city: string | undefined) => {
    setSelectedCity(city);
    onPageChanged(0);
  };


  const handleClose = () => {
    setOpenNewWarehouseForm(false);
  };

  return (
    <div>
      <div className="flex items-center py-4 gap-4 justify-between mb-5 flex-col lg:flex-row">
        <div className="flex gap-3 items-end">
          <h1 className="text-2xl font-bold">Warehouse List</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex relative">
            <Input
              placeholder="search name..."
              value={nameFilter}
              onChange={handleNameFilterChange}
              className="max-w-sm pl-10"
            />
            <FaSearch className='size-4 absolute left-4 top-0 translate-y-3 text-gray-400' />
            <CityComboBox selectedCity={selectedCity} setSelectedCity={handleCityChange} />
          </div>
          <Dialog open={openNewWarehouseForm} onOpenChange={setOpenNewWarehouseForm}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600  flex items-center gap-2"><PlusIcon size={20} /> Add New Warehouse </Button>
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogContent className="max-w-md lg:max-w-4xl" onInteractOutside={(e) => {
              e.preventDefault();
            }} >
              <AddWarehouseForm onClose={handleClose} onWarehouseAdded={onDataChanged} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col h-96">
        <Table>
          <TableHeader className="sticky-header bg-blue-600 hover:opacity-100 hover:bg-blue-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
    </div>
  )
}
