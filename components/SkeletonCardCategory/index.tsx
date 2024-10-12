import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const SkeletonCardCategory = () => {
  return (
    <div>
      <Card className=" bg-white">
        <CardHeader className="p-0">
          <Skeleton className="h-[60px] w-full  bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-4 w-full rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        </CardContent>
      </Card>
    </div>
  )
}

export default SkeletonCardCategory