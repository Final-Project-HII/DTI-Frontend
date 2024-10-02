"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar, Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { SalesReportDTO } from "@/types/salesreport";
import { salesReportApi } from "@/utils/apisales";

function SalesReport() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: addDays(new Date(2023, 0, 20), 20),
  });
  const [overallReport, setOverallReport] = useState<SalesReportDTO | null>(
    null
  );
  const [dailyReports, setDailyReports] = useState<SalesReportDTO[]>([]);

  const fetchSalesReport = async () => {
    if (!date?.from || !date?.to) return;

    try {
      const startDate = format(date.from, "yyyy-MM-dd");
      const endDate = format(date.to, "yyyy-MM-dd");

      // Fetch overall sales report
      const overallData = await salesReportApi.getOverallSalesReport(
        startDate,
        endDate
      );
      setOverallReport(overallData);

      // Fetch daily sales report
      const dailyData = await salesReportApi.getDailySalesReport(
        startDate,
        endDate
      );
      setDailyReports(dailyData.content);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  };

  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Sales Report</h1>
      <div className="flex items-center space-x-4 mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
            // initialFocus
            // mode="range"
            // defaultMonth={date?.from}
            // selected={date}
            // onSelect={handleSelect}
            // numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={fetchSalesReport}>Generate Report</Button>
      </div>

      {overallReport && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Sales Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold">
                  {overallReport.totalOrders}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${overallReport.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Products Sold</p>
                <p className="text-2xl font-bold">
                  {overallReport.totalProductsSold}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Average Order Value</p>
                <p className="text-2xl font-bold">
                  ${overallReport.averageOrderValue.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {dailyReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dailyReports}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#8884d8"
                  name="Revenue"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalOrders"
                  stroke="#82ca9d"
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SalesReport;
