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

interface TableSkeletonProps {
  rowCount?: number;
}

const WarehouseTableSkeleton: React.FC<TableSkeletonProps> = ({ rowCount = 5 }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="h-[400px] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <TableHead className="text-white font-semibold">Name</TableHead>
              <TableHead className="text-white font-semibold">Address</TableHead>
              <TableHead className="text-white font-semibold">City Name</TableHead>
              <TableHead className="text-white font-semibold w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-6 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WarehouseTableSkeleton;