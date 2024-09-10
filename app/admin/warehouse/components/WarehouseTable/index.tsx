'use client'
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useEffect, useState } from 'react'
import { DataTable } from './DataTable'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Warehouse } from '@/types/warehouse'
import { deleteWarehouse, getAllWarehouse } from '@/utils/api'
import UpdateWarehouseForm from '../UpdateWarehouseForm'
import DeleteModal from "@/components/DeleteModal"

const WarehouseTable = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | null>(null);
  const [warehouseDetail, setWarehouseDetail] = useState<Warehouse | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const fetchWarehouses = async () => {
    try {
      const response = await getAllWarehouse();
      setWarehouses(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleDeleteWarehouse = async () => {
    if (warehouseToDelete) {
      try {
        await deleteWarehouse(warehouseToDelete.id);
        await fetchWarehouses();
        setIsDeleteDialogOpen(false);
        setWarehouseToDelete(null);
      } catch (error) {
        console.error("Failed to delete warehouse:", error);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteDialogOpen(false)
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsDialogOpen(false)
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
      accessorFn: (row) => row.city?.name,
      header: "City Name",
      id: "city",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const warehouse = row.original;

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
              <DropdownMenuItem onClick={() => {
                setWarehouseDetail(warehouse)
                setIsDetailsDialogOpen(true)
              }}>View warehouse details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setWarehouseToDelete(warehouse);
                setIsDeleteDialogOpen(true);
              }}>
                Delete warehouse
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={warehouses} onDataChange={fetchWarehouses} />
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteModal onConfirm={handleDeleteWarehouse} onClose={handleCloseDeleteModal} description="Are you sure you want to delete the warehouse ?" />
      </AlertDialog>
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-md lg:max-w-4xl">
          <UpdateWarehouseForm data={warehouseDetail} onClose={handleCloseDetailsModal} onWarehouseUpdated={fetchWarehouses} />
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default WarehouseTable