'use client'
import { ColumnDef } from "@tanstack/react-table"
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
import DataTablePagination from "./DataTable/components/Pagination"
import DeleteModal from "@/components/DeleteModal"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DataTable } from "./DataTable"
import { AlertDialog } from "@/components/ui/alert-dialog"

const WarehouseTable = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | null>(null);
  const [warehouseDetail, setWarehouseDetail] = useState<Warehouse | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response = await getAllWarehouse(nameFilter, selectedCity, currentPage.toString(), pageSize.toString());
      setWarehouses(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements)
      setCurrentPage(response.pageable.pageNumber);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, [currentPage, pageSize, nameFilter, selectedCity]);



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
      header: "Name",
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
      <DataTable
        columns={columns}
        data={warehouses}
        loading={loading}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onDataChanged={fetchWarehouses}
        onPageChanged={setCurrentPage}
      />
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalElements={totalElements}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteModal onConfirm={handleDeleteWarehouse} onClose={handleCloseDeleteModal} description="Are you sure you want to delete the warehouse ?" />
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