import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const DataTablePagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange
}) => {
  const generatePaginationRange = () => {
    const range = [];
    const totalDisplayed = 3;
    const leftOffset = Math.floor(totalDisplayed / 2);
    let start = Math.max(currentPage - leftOffset, 0);
    let end = Math.min(start + totalDisplayed - 1, totalPages - 1);

    if (end - start + 1 < totalDisplayed) {
      start = Math.max(end - totalDisplayed + 1, 0);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const noData = totalElements === 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-2 mt-5 space-y-4 sm:space-y-0">
      <div className="text-sm text-muted-foreground hidden lg:block">
        {noData
          ? "No data available"
          : `Showing ${Math.min(pageSize, totalElements - currentPage * pageSize)} of ${totalElements} row(s).`
        }
      </div>
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="font-medium text-xs sm:text-sm">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
              onPageChange(0);
            }}
            disabled={noData}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          Page {noData ? 0 : currentPage + 1} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 hidden sm:inline-flex"
            onClick={() => onPageChange(0)}
            disabled={noData || currentPage === 0}
          >
            <HiChevronDoubleLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={noData || currentPage === 0}
          >
            <span className="sr-only">Go to previous page</span>
            <HiChevronLeft className="h-4 w-4" />
          </Button>
          {!noData && generatePaginationRange().map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              className={`h-8 w-8 p-0 ${currentPage === pageNumber ? "bg-blue-600" : ""} hidden sm:inline-flex`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={noData || currentPage === totalPages - 1}
          >
            <span className="sr-only">Go to next page</span>
            <HiChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 hidden sm:inline-flex"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={noData || currentPage === totalPages - 1}
          >
            <HiChevronDoubleRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTablePagination;