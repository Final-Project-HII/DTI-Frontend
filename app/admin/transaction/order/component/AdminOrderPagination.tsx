import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="space-x-2">
        <Button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          {"<<"}
        </Button>
        <Button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          {"<"}
        </Button>
        <Button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          {">"}
        </Button>
        <Button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          {">>"}
        </Button>
      </div>
      <span>
        Page <strong>{currentPage} of {totalPages}</strong>
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
          {[10, 20, 50, 100].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size} / page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AdminOrderPagination;
