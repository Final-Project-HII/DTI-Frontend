import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderTableSkeletonProps {
  rowCount?: number;
}

const OrderTableSkeleton: React.FC<OrderTableSkeletonProps> = ({ rowCount = 5 }) => {
  return (
    <ScrollArea className="w-full h-[450px] overflow-hidden bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out">
      <div className="min-w-max">
        <table className="w-full">
          <thead className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <tr>
              {['ID', 'Invoice ID', 'User ID', 'Status', 'Total Amount', 'Payment Method', 'Warehouse', 'Action'].map((header) => (
                <th key={header} className="px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(rowCount).fill(0).map((_, index) => (
              <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="border-b px-4 py-2"><Skeleton className="h-4 w-8" /></td>
                <td className="border-b px-4 py-2"><Skeleton className="h-4 w-24" /></td>
                <td className="border-b px-4 py-2"><Skeleton className="h-4 w-16" /></td>
                <td className="border-b px-4 py-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="border-b px-4 py-2"><Skeleton className="h-4 w-24" /></td>
                <td className="border-b px-4 py-2"><Skeleton className="h-4 w-20" /></td>
                <td className="border-b px-4 py-2"><Skeleton className="h-4 w-24" /></td>
                <td className="border-b px-4 py-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
};

export default OrderTableSkeleton;