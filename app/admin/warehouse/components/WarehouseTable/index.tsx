'use client'
import React from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from './DataTable'
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import warehouse from '../../page'
import { warehouseData } from '@/utils/WarehouseDummyData'

export type Warehouse = {
  id: number,
  name: string,
  addressLine: string,
  cityId: {
    id: number,
    name: string,
  },
  postalCode: string,
  lat: number,
  lon: number,
}


const columns: ColumnDef<Warehouse>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "addressLine",
    header: "Address",
  },
  {
    accessorFn: (row) => row.cityId?.name,
    header: "City Name",
    id: "city",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]


const WarehouseTable = () => {

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={warehouseData} />
    </div>
  )
}

export default WarehouseTable