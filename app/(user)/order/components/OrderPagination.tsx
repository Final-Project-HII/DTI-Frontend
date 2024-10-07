import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderPaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
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
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          {"<"}
        </Button>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
        Page <strong>{currentPage} of {totalPages}</strong>{" "}
      </span>
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => {
          setPageSize(Number(value));
          setCurrentPage(1);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select page size" />
        </SelectTrigger>
        <SelectContent>
          {[10, 20, 30, 40, 50].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              Show {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrderPagination;