import { useState } from "react";
import axios from "axios";
import { ReportType, SalesReport, SaleStatus } from "@/types/salesreport";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const useSalesReport = () => {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async (
    reportType: ReportType,
    date: Date,
    saleStatus: SaleStatus
  ) => {
    setIsLoading(true);
    setError(null);

    const endpoint =
      reportType === "daily"
        ? "api/reports/sales/daily"
        : "api/reports/sales/monthly";
    const dateParam =
      reportType === "daily"
        ? date.toISOString().split("T")[0]
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;

    try {
      const response = await axios.get<SalesReport>(`${API_URL}${endpoint}`, {
        params: {
          [reportType === "daily" ? "date" : "yearMonth"]: dateParam,
          saleStatus: saleStatus,
        },
      });
      setReport(response.data);
    } catch (err) {
      setError("Failed to fetch report. Please try again.");
      console.error("Error fetching report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { report, isLoading, error, fetchReport };
};

export default useSalesReport;
