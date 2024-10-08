import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface MonthlySales {
  month: string;
  totalRevenue: number;
  totalOrders: number;
}

const monthOrder = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const YearlySalesChart: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [salesData, setSalesData] = useState<MonthlySales[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchYearlySalesData = async (selectedYear: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}api/reports/sales/yearly`, {
        params: { year: selectedYear },
      });
      const sortedData = response.data.sort(
        (a: MonthlySales, b: MonthlySales) =>
          monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
      );
      setSalesData(sortedData);
    } catch (err) {
      setError("Failed to fetch yearly sales data");
      console.error("Error fetching yearly sales data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchYearlySalesData(year);
  }, [year]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Yearly Sales Overview (Delivered Orders)</span>
          <Select
            value={year.toString()}
            onValueChange={(value) => setYear(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((yearOption) => (
                <SelectItem key={yearOption} value={yearOption.toString()}>
                  {yearOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={salesData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Total Revenue")
                    return formatCurrency(value as number);
                  return value;
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalRevenue"
                name="Total Revenue"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalOrders"
                name="Total Orders"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default YearlySalesChart;
