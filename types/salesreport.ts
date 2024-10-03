export type SalesReport = {
  startDate: string;
  endDate: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalProductsSold: number;
};

export type ReportType = "daily" | "monthly";
export type SaleStatus = "shipped" | "delivered";
