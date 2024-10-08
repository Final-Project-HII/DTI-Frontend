'use client';

import React, { useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthYearPicker } from '@/components/ui/date-picker';
import { SummaryCard } from './_components/SummaryCard';
import { ProductSummaryChart, CategorySalesChart, ProductSalesChart, DailySalesChart } from './_components/Charts';
import { useDashboardData } from '@/hooks/useDashboardData';

interface DailySalesData {
    date: string;
    totalSales: number;
    totalOrders: number;
}
export default function CombinedDashboard() {
    const { data: session } = useSession();
    const {
        selectedWarehouse,
        setSelectedWarehouse,
        selectedDate,
        setSelectedDate,
        warehouses,
        productSortOrder,
        setProductSortOrder,
        categorySalesData,
        productSalesData,
        dailySalesData,
        salesSummaryData,
        stockReportData,
        isLoading,
    } = useDashboardData();

    const isSuperAdmin = session?.user?.role === 'SUPER';
    const isAdmin = session?.user?.role === 'ADMIN';

    useEffect(() => {
        if (isAdmin && dailySalesData?.data?.content && dailySalesData.data.content.length > 0) {
            const loginWarehouseId = dailySalesData.data.content[0].loginWarehouseId;
            if (loginWarehouseId !== undefined) {
                setSelectedWarehouse(loginWarehouseId.toString());
            }
        }
    }, [isAdmin, dailySalesData, setSelectedWarehouse]);

    const salesSummary = salesSummaryData?.data?.content?.[0];
    const stockSummary = stockReportData?.summary ?? { totalAddition: 0, totalReduction: 0, endingStock: 0 };

    const stockInTotal = stockSummary.totalAddition;
    const stockOutTotal = stockSummary.totalReduction;
    const totalStock = stockSummary.endingStock;
    const stockInPercentage = totalStock > 0 ? (stockInTotal / totalStock) * 100 : 0;
    const stockOutPercentage = totalStock > 0 ? (stockOutTotal / totalStock) * 100 : 0;

    const sortedProductData = useMemo(() => {
        if (!stockReportData?.summary?.productSummaries?.content) return [];

        const sortedData = [...stockReportData.summary.productSummaries.content].sort((a, b) => {
            if (productSortOrder === 'highest') {
                return b.endingStock - a.endingStock;
            } else {
                return a.endingStock - b.endingStock;
            }
        });

        return sortedData.slice(0, 5).map(product => ({
            ...product,
            productName: product.productName.length > 12 ? `${product.productName.slice(0, 12)}...` : product.productName
        }));
    }, [stockReportData, productSortOrder]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold">Sales and Stock Dashboard</h1>

            <div className="flex justify-end gap-4">
                {isSuperAdmin ? (
                    <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Warehouses</SelectItem>
                            {warehouses.map((warehouse) => (
                                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                    {warehouse.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : isAdmin && selectedWarehouse && (
                    <div className="text-sm text-muted-foreground">
                        Selected Warehouse: {warehouses.find(w => w.id.toString() === selectedWarehouse)?.name}
                    </div>
                )}
                <MonthYearPicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date as Date)}
                    dateFormat="yyyy-MM"
                />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <SummaryCard
                    title="Total Orders"
                    value={salesSummary?.totalOrders || 0}
                    percentage={0}
                    isPositive={true}
                    showPercentage={false}
                    icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                />
                <SummaryCard
                    title="Total Gross Revenue"
                    value={Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(salesSummary?.totalGrossRevenue || 0)}
                    percentage={0}
                    isPositive={true}
                    showPercentage={false}
                    icon={<LineChartIcon className="h-4 w-4 text-muted-foreground" />}
                />
                <SummaryCard
                    title="Stock In"
                    value={stockInTotal}
                    percentage={stockInPercentage}
                    isPositive={true}
                    icon={<ArrowUpIcon className="h-4 w-4 text-muted-foreground" />}
                />
                <SummaryCard
                    title="Stock Out"
                    value={stockOutTotal}
                    percentage={stockOutPercentage}
                    isPositive={false}
                    icon={<ArrowDownIcon className="h-4 w-4 text-muted-foreground" />}
                />
                <SummaryCard
                    title="Total Stock"
                    value={totalStock}
                    percentage={0}
                    isPositive={true}
                    showPercentage={false}
                    icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            <Tabs defaultValue="product-summary" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="product-summary">Product Summary</TabsTrigger>
                    <TabsTrigger value="category-sales">Category Sales</TabsTrigger>
                    <TabsTrigger value="product-sales">Product Sales</TabsTrigger>
                    <TabsTrigger value="daily-sales">Daily Sales</TabsTrigger>
                </TabsList>
                <TabsContent value="product-summary">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Product Stock Mutation Summary (Top 5)</CardTitle>
                            <Select value={productSortOrder} onValueChange={(value: 'highest' | 'lowest') => setProductSortOrder(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="highest">Highest Stock</SelectItem>
                                    <SelectItem value="lowest">Lowest Stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            <ProductSummaryChart data={sortedProductData} />
                            {(stockReportData?.summary?.productSummaries?.content?.length ?? 0) > 5 && (
                                <p className="text-center mt-4">
                                    Showing 5 products with {productSortOrder} stock.
                                    {((stockReportData?.summary?.productSummaries?.content?.length ?? 0) - 5)} more products not shown.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="category-sales">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Category Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CategorySalesChart
                                data={categorySalesData?.data?.content?.map(category => ({
                                    ...category,
                                    percentage: (category.totalOrders / categorySalesData.data.content.reduce((sum, cat) => sum + cat.totalOrders, 0)) * 100
                                })) || []}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="product-sales">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Product Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProductSalesChart
                                data={productSalesData?.data?.content?.slice(0, 5)?.map(product => ({
                                    ...product,
                                    productName: product.productName.length > 12 ? `${product.productName.slice(0, 12)}...` : product.productName
                                })) || []}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="daily-sales">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Sales and Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DailySalesChart
                                data={Object.values(dailySalesData?.data?.content?.reduce((acc, order) => {
                                    if (order && order.orderDate) {
                                        const date = order.orderDate.split('T')[0];
                                        if (!acc[date]) {
                                            acc[date] = { date, totalSales: 0, totalOrders: 0 };
                                        }
                                        acc[date].totalSales += order.originalAmount || 0;
                                        acc[date].totalOrders += 1; // Increment order count
                                    }
                                    return acc;
                                }, {} as Record<string, DailySalesData>) || {})}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}