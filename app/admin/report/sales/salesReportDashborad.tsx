// "use client";
// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";

// import YearlySalesChart from "./YearlySalesChart";
// import { ReportType, SaleStatus } from "@/types/salesreport";
// import useSalesReport from "@/hooks/useSalesReport";

// const formatCurrency = (amount: number) => {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(amount);
// };

// const SalesReportDashboard: React.FC = () => {
//   const [reportType, setReportType] = useState<ReportType>("daily");
//   const [date, setDate] = useState<Date | undefined>(new Date());
//   const [saleStatus, setSaleStatus] = useState<SaleStatus>("delivered");
//   const { report, isLoading, error, fetchReport } = useSalesReport();

//   const handleGenerateReport = () => {
//     if (date) {
//       fetchReport(reportType, date, saleStatus);
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Sales Report Dashboard</h1>

//       <Card className="mb-6">
//         <CardContent className="pt-6">
//           <div className="flex space-x-4 mb-4">
//             <Select
//               value={reportType}
//               onValueChange={(value: ReportType) => setReportType(value)}
//             >
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select report type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="daily">Daily Report</SelectItem>
//                 <SelectItem value="monthly">Monthly Report</SelectItem>
//               </SelectContent>
//             </Select>

//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="w-[260px] justify-start text-left font-normal"
//                 >
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {date
//                     ? reportType === "daily"
//                       ? format(date, "PPP")
//                       : format(date, "MMMM yyyy")
//                     : "Pick a date"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0">
//                 <Calendar
//                   mode="single"
//                   selected={date}
//                   onSelect={setDate}
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>

//             <Select
//               value={saleStatus}
//               onValueChange={(value: SaleStatus) => setSaleStatus(value)}
//             >
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select sale status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="SHIPPED">Shipped</SelectItem>
//                 <SelectItem value="DELIVERED">Delivered</SelectItem>
//               </SelectContent>
//             </Select>

//             <Button onClick={handleGenerateReport} disabled={isLoading}>
//               {isLoading ? "Loading..." : "Generate Report"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {error && <div className="text-red-500 mb-4">{error}</div>}

//       {report && (
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Total Orders</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold">{report.totalOrders}</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Total Revenue</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold">
//                 {formatCurrency(report.totalRevenue)}
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Average Order Value</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold">
//                 {formatCurrency(report.averageOrderValue)}
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Total Products Sold</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold">{report.totalProductsSold}</p>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       <YearlySalesChart />
//     </div>
//   );
// };

// export default SalesReportDashboard;
