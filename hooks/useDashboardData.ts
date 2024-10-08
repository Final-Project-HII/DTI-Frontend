import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Warehouse, ApiResponse, SalesSummary, CategorySales, ProductSales, DailySales, ProductSummary } from '../types/dashboard';

const BASE_URL = 'http://localhost:8080/api';
// const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;

const fetchCategorySales = async (token: string, warehouseId: string, month: string): Promise<ApiResponse<CategorySales>> => {
    const response = await axios.get(`${BASE_URL}/sales/report/category`, {
        params: { warehouseId, month },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const fetchProductSales = async (token: string, warehouseId: string, month: string): Promise<ApiResponse<ProductSales>> => {
    const response = await axios.get(`${BASE_URL}/sales/report/product`, {
        params: { warehouseId, month },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const fetchDailySales = async (token: string, warehouseId: string, month: string): Promise<ApiResponse<DailySales>> => {
    const response = await axios.get(`${BASE_URL}/sales/report`, {
        params: { warehouseId, status: 'delivered', month },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const fetchSalesSummary = async (token: string, warehouseId: string, month: string): Promise<ApiResponse<SalesSummary>> => {
    const response = await axios.get(`${BASE_URL}/sales/report/summary`, {
        params: { warehouseId, month },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const fetchStockReport = async (token: string, warehouseId: string, month: string, page: number, size: number): Promise<ApiResponse<ProductSummary>> => {
    const response = await axios.get(`${BASE_URL}/stock-mutations/report`, {
        params: { warehouseId, month, page, size },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const useDashboardData = () => {
    const [selectedWarehouse, setSelectedWarehouse] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [productSummaryPage, setProductSummaryPage] = useState(0);
    const [productSummaryPageSize, setProductSummaryPageSize] = useState(50);
    const [productSortOrder, setProductSortOrder] = useState<'highest' | 'lowest'>('highest');
    const { data: session } = useSession();

    useEffect(() => {
        axios.get<{ data: { content: Warehouse[] } }>(`${BASE_URL}/warehouses`)
            .then(response => {
                setWarehouses(response.data.data.content);
            })
            .catch(error => console.error("Failed to fetch warehouses:", error));
    }, []);

    const formattedMonth = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;

    const categorySalesQuery = useQuery<ApiResponse<CategorySales>>({
        queryKey: ['category-sales', selectedWarehouse, formattedMonth],
        queryFn: () => fetchCategorySales(session?.user?.accessToken!, selectedWarehouse === 'all' ? '' : selectedWarehouse, formattedMonth),
        enabled: !!session?.user?.accessToken
    });

    const productSalesQuery = useQuery<ApiResponse<ProductSales>>({
        queryKey: ['product-sales', selectedWarehouse, formattedMonth],
        queryFn: () => fetchProductSales(session?.user?.accessToken!, selectedWarehouse === 'all' ? '' : selectedWarehouse, formattedMonth),
        enabled: !!session?.user?.accessToken
    });

    const dailySalesQuery = useQuery<ApiResponse<DailySales>>({
        queryKey: ['daily-sales', selectedWarehouse, formattedMonth],
        queryFn: () => fetchDailySales(session?.user?.accessToken!, selectedWarehouse === 'all' ? '' : selectedWarehouse, formattedMonth),
        enabled: !!session?.user?.accessToken
    });

    const salesSummaryQuery = useQuery<ApiResponse<SalesSummary>>({
        queryKey: ['sales-summary', selectedWarehouse, formattedMonth],
        queryFn: () => fetchSalesSummary(session?.user?.accessToken!, selectedWarehouse === 'all' ? '' : selectedWarehouse, formattedMonth),
        enabled: !!session?.user?.accessToken
    });

    const stockReportQuery = useQuery<ApiResponse<ProductSummary>>({
        queryKey: ['stock-report', selectedWarehouse, formattedMonth, productSummaryPage, productSummaryPageSize],
        queryFn: () => fetchStockReport(session?.user?.accessToken!, selectedWarehouse === 'all' ? '' : selectedWarehouse, formattedMonth, productSummaryPage, productSummaryPageSize),
        enabled: !!session?.user?.accessToken
    });

    return {
        selectedWarehouse,
        setSelectedWarehouse,
        selectedDate,
        setSelectedDate,
        warehouses,
        productSummaryPage,
        setProductSummaryPage,
        productSummaryPageSize,
        setProductSummaryPageSize,
        productSortOrder,
        setProductSortOrder,
        categorySalesData: categorySalesQuery.data,
        productSalesData: productSalesQuery.data,
        dailySalesData: dailySalesQuery.data,
        salesSummaryData: salesSummaryQuery.data,
        stockReportData: stockReportQuery.data,
        isLoading: categorySalesQuery.isLoading || productSalesQuery.isLoading || dailySalesQuery.isLoading || salesSummaryQuery.isLoading || stockReportQuery.isLoading,
        session
    };
};