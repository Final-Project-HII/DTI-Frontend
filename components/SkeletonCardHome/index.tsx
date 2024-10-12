import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCardHome: React.FC = () => (
  <div>
    <Card className=" rounded-xl bg-white">
      <CardHeader className="p-0">
        <Skeleton className="h-[200px] w-full rounded-t-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4 mb-2 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        <Skeleton className="h-4 w-2/3 mb-2 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        <Skeleton className="h-5 w-1/3 mb-2 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        <Skeleton className="h-4 w-1/2 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      </CardContent>
      <CardFooter className="p-4">
        <Skeleton className="h-10 w-full rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      </CardFooter>
    </Card>
  </div>
);
