import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Warehouse, ApiResponse, SalesSummary, CategorySales, ProductSales, SalesDetail } from '@/types/salesreport';

const BASE_URL = 'http://localhost:8080/api';

const fetchSalesSummary = async (token: string, warehouseId: string, month: string): Promise<ApiResponse<SalesSummary>> => {
    const response = await axios.get(`${BASE_URL}/sales/report/summary`, {
        params: { warehouseId, month },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const fetchCategorySales = async (token: string, warehouseId: string, month: string, page: number, size: number): Promise<ApiResponse<CategorySales>> => {
    const response = await axios.get(`${BASE_URL}/sales/report/category`, {
        params: { warehouseId, month, page, size },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const fetchProductSales = async (token: string, warehouseId: string, month: string, page: number, size: number): Promise<ApiResponse<ProductSales>> => {
    const response = await axios.get(`${BASE_URL}/sales/report/product`, {
        params: { warehouseId, month, page, size },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const fetchSalesDetails = async (token: string, warehouseId: string, status: string, month: string, productId: string, categoryId: string, page: number, size: number): Promise<ApiResponse<SalesDetail>> => {
    const response = await axios.get(`${BASE_URL}/sales/report`, {
        params: { warehouseId, status, month, productId, categoryId, page, size },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const useSalesReport = () => {
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('74');
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2024, 9));
    const [categorySalesPage, setCategorySalesPage] = useState(0);
    const [productSalesPage, setProductSalesPage] = useState(0);
    const [salesDetailsPage, setSalesDetailsPage] = useState(0);
    const [pageSize, setPageSize] = useState(50);
    const { data: session, status } = useSession();

    useEffect(() => {
        axios.get<{ data: { content: Warehouse[] } }>(`${BASE_URL}/warehouses`)
            .then(response => {
                setWarehouses(response.data.data.content);
            })
            .catch(error => console.error("Failed to fetch warehouses:", error));
    }, []);

    const formattedMonth = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}` : '';

    const summaryQuery = useQuery<ApiResponse<SalesSummary>>({
        queryKey: ['sales-summary', selectedWarehouse, formattedMonth, session?.user?.accessToken],
        queryFn: () => fetchSalesSummary(session?.user?.accessToken!, selectedWarehouse, formattedMonth),
        enabled: !!session?.user?.accessToken && !!selectedDate,
    });

    const categorySalesQuery = useQuery<ApiResponse<CategorySales>>({
        queryKey: ['category-sales', selectedWarehouse, formattedMonth, categorySalesPage, pageSize, session?.user?.accessToken],
        queryFn: () => fetchCategorySales(session?.user?.accessToken!, selectedWarehouse, formattedMonth, categorySalesPage, pageSize),
        enabled: !!session?.user?.accessToken && !!selectedDate,
    });

    const productSalesQuery = useQuery<ApiResponse<ProductSales>>({
        queryKey: ['product-sales', selectedWarehouse, formattedMonth, productSalesPage, pageSize, session?.user?.accessToken],
        queryFn: () => fetchProductSales(session?.user?.accessToken!, selectedWarehouse, formattedMonth, productSalesPage, pageSize),
        enabled: !!session?.user?.accessToken && !!selectedDate,
    });

    const salesDetailsQuery = useQuery<ApiResponse<SalesDetail>>({
        queryKey: ['sales-details', selectedWarehouse, formattedMonth, salesDetailsPage, pageSize, session?.user?.accessToken],
        queryFn: () => fetchSalesDetails(session?.user?.accessToken!, selectedWarehouse, 'delivered', formattedMonth, '', '', salesDetailsPage, pageSize),
        enabled: !!session?.user?.accessToken && !!selectedDate,
    });

    useEffect(() => {
        if (session?.user?.role === 'ADMIN' && salesDetailsQuery.data?.data?.content && salesDetailsQuery.data.data.content.length > 0) {
            const loginWarehouseId = salesDetailsQuery.data.data.content[0].loginWarehouseId;
            if (loginWarehouseId !== undefined) {
                setSelectedWarehouse(loginWarehouseId.toString());
            }
        }
    }, [session?.user?.role, salesDetailsQuery.data]);

    return {
        selectedWarehouse,
        setSelectedWarehouse,
        warehouses,
        selectedDate,
        setSelectedDate,
        categorySalesPage,
        setCategorySalesPage,
        productSalesPage,
        setProductSalesPage,
        salesDetailsPage,
        setSalesDetailsPage,
        pageSize,
        setPageSize,
        summaryQuery,
        categorySalesQuery,
        productSalesQuery,
        salesDetailsQuery,
        session,
    };
};