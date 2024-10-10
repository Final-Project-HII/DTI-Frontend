import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CartSkeleton: React.FC = () => {
  return (
    <div className="mt-28 container mx-auto p-4">
      <Skeleton className="w-48 h-8 mb-4" />
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-grow w-full lg:w-2/3">
          <CardHeader>
            <Skeleton className="w-48 h-6" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b pb-4">
                <div className="flex items-center mb-2 sm:mb-0">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="ml-4">
                    <Skeleton className="w-32 h-4 mb-2" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                  <Skeleton className="w-24 h-8 mr-4" />
                  <Skeleton className="w-24 h-4" />
                </div>
              </div>
            ))}
            <Skeleton className="w-40 h-10 mt-4" />
          </CardContent>
        </Card>
        <Card className="w-full lg:w-1/3 h-fit">
          <CardContent className="flex flex-col gap-4 mt-10">
            <div className="flex justify-between">
              <Skeleton className="w-24 h-6" />
              <Skeleton className="w-32 h-6" />
            </div>
            <Skeleton className="w-full h-10" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartSkeleton;