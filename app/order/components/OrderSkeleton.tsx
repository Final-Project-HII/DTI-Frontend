import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const OrderSkeleton: React.FC = () => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="mt-4 flex justify-between items-center">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-8 w-40" />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSkeleton;