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
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table"
import { PlusIcon } from "lucide-react"
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import AddWarehouseForm from "../../AddWarehoseForm"
import CityComboBox from "./components/CityComboBox"
import DataTablePagination from "./components/Pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onDataChange: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onDataChange
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined)
  const [openNewWarehouseForm, setOpenNewWarehouseForm] = useState(false);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  React.useEffect(() => {
    table.getColumn("city")?.setFilterValue(selectedCity || "")
  }, [selectedCity, table])


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
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm pl-10"
            />
            <FaSearch className='size-4 absolute left-4 top-0 translate-y-3 text-gray-400' />
            <CityComboBox selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
          </div>
          <Dialog open={openNewWarehouseForm} onOpenChange={setOpenNewWarehouseForm}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600  flex items-center gap-2"><PlusIcon size={20} /> Add New Warehouse </Button>
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogContent className="max-w-md lg:max-w-4xl">
              <AddWarehouseForm onClose={handleClose} onWarehouseAdded={onDataChange} />
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
            {table.getRowModel().rows?.length ? (
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
      <DataTablePagination table={table} />
    </div>
  )
}
