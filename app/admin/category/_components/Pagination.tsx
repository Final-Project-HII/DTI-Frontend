import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface DataTablePaginationProps {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    setPageIndex: (index: number) => void;
    setPageSize: (size: number) => void;
    getCanPreviousPage: () => boolean;
    getCanNextPage: () => boolean;
    getRowModel: () => { rows: any[] };
    getCoreRowModel: () => { rows: any[] };
}

export function DataTablePagination({
    pageIndex,
    pageSize,
    pageCount,
    setPageIndex,
    setPageSize,
    getCanPreviousPage,
    getCanNextPage,
    getRowModel,
    getCoreRowModel
}: DataTablePaginationProps) {
    const generatePaginationRange = () => {
        const currentPage = pageIndex + 1;
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
                Showing {getRowModel().rows.length} of {getCoreRowModel().rows.length} row(s).
            </div>
            <div className="flex items-center space-x-12 lg:space-x-8">
                <div className="flex items-center space-x-1">
                    <p className="font-medium text-xs lg:text-sm">Rows per page</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => setPageSize(Number(value))}
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
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {pageIndex + 1} of {pageCount}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPageIndex(0)}
                        disabled={!getCanPreviousPage()}
                    >
                        <HiChevronDoubleLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPageIndex(pageIndex - 1)}
                        disabled={!getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <HiChevronLeft className="h-4 w-4" />
                    </Button>
                    {generatePaginationRange().map((pageNumber) => (
                        <Button
                            key={pageNumber}
                            variant={pageIndex + 1 === pageNumber ? "default" : "outline"}
                            className={`h-8 w-8 p-0 ${pageIndex + 1 === pageNumber && "bg-blue-600"}`}
                            onClick={() => setPageIndex(pageNumber - 1)}
                        >
                            {pageNumber}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPageIndex(pageIndex + 1)}
                        disabled={!getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <HiChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPageIndex(pageCount - 1)}
                        disabled={!getCanNextPage()}
                    >
                        <HiChevronDoubleRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}