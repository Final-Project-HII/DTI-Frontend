// src/types/salesReport.ts

export interface SalesReportDTO {
    date: string | null;
    totalOrders: number;
    totalRevenue: number;
    totalProductsSold: number;
    averageOrderValue: number;
  }
  
  export interface DailySalesReportResponse {
    content: SalesReportDTO[];
    // Add pagination info if your backend provides it
    // totalPages: number;
    // totalElements: number;
    // size: number;
    // number: number;
  }