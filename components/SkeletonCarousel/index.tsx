import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const SkeletonCarousel = () => {
  return (
    <div>
      <Card className="">

        <Skeleton className="h-[150px] w-full  bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 md:h-[250px] lg:h-[350px]" />

      </Card>
    </div>
  )
}

export default SkeletonCarousel