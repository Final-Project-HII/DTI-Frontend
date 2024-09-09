import React from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table } from "@tanstack/react-table"
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi"

interface PaginationProps<TData> {
  table: Table<TData>
}

const DataTablePagination = <TData,>({ table }: PaginationProps<TData>) => {
  const currentPage = table.getState().pagination.pageIndex + 1
  const pageCount = table.getPageCount()

  const generatePaginationRange = () => {
    const range = [];
    const totalDisplayed = 3;
    const leftOffset = Math.floor(totalDisplayed / 2);
    let start = Math.max(currentPage - leftOffset, 1);
    let end = Math.min(start + totalDisplayed - 1, pageCount);

    if (end - start + 1 < totalDisplayed) {
      start = Math.max(end - totalDisplayed + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div className="flex items-center justify-between px-2 mt-5 lg:mt-0">
      <div className="flex-1 text-sm text-muted-foreground hidden lg:block">
        Showing {table.getRowModel().rows.length} of {table.getCoreRowModel().rows.length} row(s).
      </div>
      <div className="flex items-center space-x-12 lg:space-x-8">
        <div className="flex items-center space-x-1">
          <p className="font-medium text-xs lg:text-sm">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <HiChevronDoubleLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <HiChevronLeft className="h-4 w-4" />
          </Button>
          {generatePaginationRange().map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              className={`h-8 w-8 p-0 ${currentPage === pageNumber && "bg-blue-600"}`}
              onClick={() => table.setPageIndex(pageNumber - 1)}
            >
              {pageNumber}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <HiChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            <HiChevronDoubleRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataTablePagination