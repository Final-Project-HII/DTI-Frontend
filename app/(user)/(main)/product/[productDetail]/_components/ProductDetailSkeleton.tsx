import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductDetailSkeleton = () => {
    return (
        <div className="w-full lg:py-32 p-4 md:p-8 lg:p-16 bg-gray-50">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8">
                <div className="space-y-4">
                    <Skeleton className="w-full aspect-square rounded-lg" />
                    <div className="grid grid-cols-4 gap-2">
                        {[...Array(4)].map((_, index) => (
                            <Skeleton key={index} className="w-full aspect-square rounded-md" />
                        ))}
                    </div>
                </div>
                <div className='space-y-4'>
                    <Card className="w-full bg-white">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div className="flex justify-between items-start border-b pb-4">
                                    <Skeleton className="h-8 w-3/4" />
                                </div>
                                <div className="space-y-2">
                                    <div className='flex items-center space-x-2'>
                                        <Skeleton className="h-6 w-12" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-10 w-1/2" />
                                </div>
                                <div className='flex items-center justify-between flex-wrap gap-4'>
                                    <Skeleton className="h-12 w-32" />
                                    <Skeleton className="h-12 w-32" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full bg-white">
                        <CardContent className="p-6">
                            <div className='flex items-center space-x-4'>
                                <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
                                <div>
                                    <Skeleton className="h-6 w-24 mb-2" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full bg-white">
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-40 mb-2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
