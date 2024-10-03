import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminTableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
}

const AdminTableSkeleton: React.FC<AdminTableSkeletonProps> = ({ rowCount = 5, columnCount = 4 }) => {
  return (
    <div className="flex flex-col h-[26rem] overflow-hidden bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out mb-5">
      <Table>
        <TableHeader className="sticky-header bg-blue-600 hover:opacity-100 hover:bg-blue-600">
          <TableRow className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            {Array.from({ length: columnCount }).map((_, index) => (
              <TableHead key={index} className="text-white">
                <Skeleton className="h-4 w-24 bg-blue-300" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columnCount }).map((_, cellIndex) => (
                <TableCell key={cellIndex}>
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

export default AdminTableSkeleton;