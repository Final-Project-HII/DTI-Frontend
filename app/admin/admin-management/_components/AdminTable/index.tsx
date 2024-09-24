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
import { deleteWarehouse, getAllUser, getAllWarehouse, toogleUserActiveStatus } from '@/utils/api'
import DeleteModal from "@/components/DeleteModal"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, EditIcon, MoreHorizontal, XCircle } from "lucide-react"
import { AlertDialog } from "@/components/ui/alert-dialog"
import blankImage from '@/public/empty-profile-image.png'
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTableAdmin } from "./components/DataTable"
import DataTablePagination from "./components/DataTable/components/Pagination"
import UpdateAdminForm from "./components/DataTable/components/UpdateAdminForm"

interface User {
  id: number;
  name: string;
  warehouseId: null | number;
  imageUrl: string | null;
  email: string;
  isVerified: boolean;
  role: string;
  isActive: boolean;
}

const AdminTable = () => {
  const [adminData, setAdminData] = useState<User[]>([]);
  const [adminDetailData, setAdminDetailData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isUpdateAdminDialogOpen, setIsUpdateAdminDialogOpen] = useState<boolean>(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const response = await getAllUser(emailFilter, selectedRole, currentPage.toString(), pageSize.toString());
      setAdminData(response.content);
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
    fetchAdminData();
  }, [currentPage, pageSize, emailFilter, selectedRole]);

  const handleCloseUpdateModal = () => {
    setIsUpdateAdminDialogOpen(false)
  }

  const columns: ColumnDef<User, keyof User>[] = [
    {
      accessorKey: "name",
      header: "Admin",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user.imageUrl || undefined} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "isVerified",
      header: () => <div className="text-center">Verified</div>,
      cell: ({ row }) => {
        const isVerified = row.original.isVerified;
        return (
          <div className="w-full justify-center text-center items-center justify-items-center flex">
            {isVerified ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        switch (row.original.role) {
          case "ADMIN":
            return "Admin";
          case "USER":
            return "User";
          case "SUPER":
            return "Super Admin";
          default:
            return row.original.role;
        }
      },
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Switch
            checked={user.isActive}
            className="data-[state=checked]:bg-blue-600"
            onCheckedChange={async () => {
              try {
                await toogleUserActiveStatus(user.id);
                setAdminData(prevData =>
                  prevData.map(admin =>
                    admin.id === user.id ? { ...admin, isActive: !admin.isActive } : admin
                  )
                );
              } catch (error) {
                console.error("Failed to update user status", error);
              }
            }}
          />
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        if (user.role === "ADMIN") {
          return (
            <EditIcon className="text-blue-600 hover:text-gray-600" onClick={() => {
              setAdminDetailData(user);
              setIsUpdateAdminDialogOpen(true)
            }} />
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTableAdmin<User, keyof User>
        columns={columns}
        data={adminData}
        loading={loading}
        emailFilter={emailFilter}
        setEmailFilter={setEmailFilter}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onDataChanged={fetchAdminData}
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
      <Dialog open={isUpdateAdminDialogOpen} onOpenChange={setIsUpdateAdminDialogOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-sm lg:max-w-md" onInteractOutside={(e) => {
          e.preventDefault();
        }}>
          <UpdateAdminForm data={adminDetailData} onClose={handleCloseUpdateModal} onAdminUpdated={fetchAdminData} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminTable