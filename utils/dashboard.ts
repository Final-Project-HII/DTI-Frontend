import axios from 'axios';
import { ApiResponse, CategorySales, ProductSales, DailySales, SalesSummary, ProductSummary, Warehouse } from '../types/dashboard';

const BASE_URL = 'http://localhost:8080/api';

export const fetchCategorySales = async (token: string, warehouseId: string, month: string): Promise<ApiResponse<CategorySales>> => {
    const response = await axios.get(`${BASE_URL}/sales/report/category`, {
        params: { warehouseId, month },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchProductSales = async (token: string, warehouseId: string, month: string): Promise<ApiResponse<ProductSales>> => {
    const response = await axios.get(`${BASE_URL}/sales/report/product`, {
        params: { warehouseId, month },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchDailySales = async (token: string, warehouseId: string, month: string): Promise<ApiResponse<DailySales>> => {
    const response = await axios.get(`${BASE_URL}/sales/report`, {
        params: { warehouseId, status: 'delivered', month },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchSalesSummary = async (token: string, warehouseId: string, month: string): Promise<ApiResponse<SalesSummary>> => {
    const response = await axios.get(`${BASE_URL}/sales/report/summary`, {
        params: { warehouseId, month },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchStockReport = async (token: string, warehouseId: string, month: string, page: number, size: number): Promise<ApiResponse<ProductSummary>> => {
    const response = await axios.get(`${BASE_URL}/stock-mutations/report`, {
        params: { warehouseId, month, page, size },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const fetchWarehouses = async (): Promise<Warehouse[]> => {
    const response = await axios.get<{ data: { content: Warehouse[] } }>(`${BASE_URL}/warehouses`);
    return response.data.data.content;
};