import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface AdminOrderPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalItems: number;
}

const AdminOrderPagination: React.FC<AdminOrderPaginationProps> = ({
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalItems,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => setCurrentPage(i - 1)} // Subtract 1 when setting the page
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          className={`mx-1 ${
            currentPage === i ? "bg-blue-600 text-white" : "text-blue-600"
          }`}
        >
          {i}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between mt-4 bg-white p-4 rounded-lg shadow">
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => setCurrentPage(0)} // Set to 0 for the first page
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="text-blue-600"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setCurrentPage(Math.max(currentPage - 2, 0))} // Subtract 2 to go back one page (since we're displaying currentPage + 1)
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="text-blue-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {renderPageNumbers()}
        <Button
          onClick={() => setCurrentPage(Math.min(currentPage, totalPages - 1))} // Subtract 1 from totalPages
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="text-blue-600"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setCurrentPage(totalPages - 1)} // Subtract 1 from totalPages
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="text-blue-600"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong>
        </span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdminOrderPagination;