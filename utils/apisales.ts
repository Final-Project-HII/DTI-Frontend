import { DailySalesReportResponse, SalesReportDTO } from '@/types/salesreport';
import axios from 'axios';


const API_BASE_URL = '/api'; 

export const salesReportApi = {
  getOverallSalesReport: async (startDate: string, endDate: string): Promise<SalesReportDTO> => {
    const response = await axios.get<SalesReportDTO>(`${API_BASE_URL}/sales-report/overall`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  getDailySalesReport: async (startDate: string, endDate: string): Promise<DailySalesReportResponse> => {
    const response = await axios.get<DailySalesReportResponse>(`${API_BASE_URL}/sales-report/daily`, {
      params: { startDate, endDate }
    });
    return response.data;
  }
};