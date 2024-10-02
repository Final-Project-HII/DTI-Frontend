import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
    rowCount?: number;
    columnCount?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rowCount = 5, columnCount = 10 }) => {
    return (
        <div className="flex flex-col h-[450px] overflow-hidden bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                        {Array.from({ length: columnCount }).map((_, index) => (
                            <TableCell key={index} className="text-white w-[100px]">
                                <Skeleton className="h-4 w-full bg-blue-200" />
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {[...Array(rowCount)].map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            <TableCell className="w-[100px] flex items-center justify-center">
                                <div className="bg-white flex items-center justify-center p-2 w-14 h-14 rounded-xl shadow-md">
                                    <Skeleton className="h-12 w-12 rounded" />
                                </div>
                            </TableCell>
                            {Array.from({ length: columnCount - 1 }).map((_, cellIndex) => (
                                <TableCell key={cellIndex} className="w-[100px]">
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableSkeleton;