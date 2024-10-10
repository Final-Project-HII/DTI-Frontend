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

interface OrderPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalItems: number;
}

const OrderPagination: React.FC<OrderPaginationProps> = ({
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalItems,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage: number;
    let endPage: number;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => setCurrentPage(i)}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          className={`mx-1 ${
            currentPage === i ? "bg-gray-600 text-white" : "text-gray-600"
          } hidden sm:inline-flex`}
        >
          {i}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 bg-white p-2 rounded-lg shadow">
      <div className="flex items-center space-x-1 mb-2 sm:mb-0">
        <Button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="text-gray-600"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="text-gray-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {renderPageNumbers()}
        <Button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="text-gray-600"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="text-gray-600"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            setPageSize(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((size) => (
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

export default OrderPagination;