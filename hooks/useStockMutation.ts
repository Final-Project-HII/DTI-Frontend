import axios from 'axios';
import { StockMutationJournalResponse, StockReportResponse, Warehouse } from '../types/stockMutation';

const BASE_URL = 'http://localhost:8080/api';
// const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;

export const fetchStockReport = async (
    token: string,
    warehouseId: string,
    month: string,
    page: number,
    size: number
): Promise<StockReportResponse> => {
    const response = await axios.get(
        `${BASE_URL}/stock-mutations/report`,
        {
            params: { warehouseId, month, page, size },
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data.data;
};

export const fetchStockMutationJournals = async (
    token?: string,
    warehouseId?: string,
    productName?: string,
    mutationType?: 'IN' | 'OUT',
    startDate?: string,
    endDate?: string,
    page: number = 0,
    size: number = 20
): Promise<StockMutationJournalResponse> => {
    const params = new URLSearchParams();
    if (warehouseId) params.append('warehouseId', warehouseId);
    if (productName) params.append('productName', productName);
    if (mutationType) params.append('mutationType', mutationType);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('page', String(page));
    params.append('size', String(size));

    const response = await axios.get<StockMutationJournalResponse>(
        `${BASE_URL}/stock-mutations/journal?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const fetchWarehouses = async () => {
    const response = await axios.get<{ data: { content: Warehouse[] } }>(`${BASE_URL}/warehouses`);
    return response.data.data.content;
};