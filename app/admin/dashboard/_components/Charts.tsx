import React from 'react';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Line } from 'recharts';
import { CategorySales, ProductSales, DailySales, ProductSummary } from '@/types/dashboard';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const ProductSummaryChart = ({ data }: { data: ProductSummary[] }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="productName" angle={-45} textAnchor="end" height={85} interval={0} tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalAddition" fill={COLORS[0]} name="Total Addition" />
                <Bar dataKey="totalReduction" fill={COLORS[1]} name="Total Reduction" />
                <Bar dataKey="endingStock" fill={COLORS[2]} name="Ending Stock" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export const CategorySalesChart = ({ data }: { data: CategorySales[] }) => (
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie
                data={data}
                dataKey="percentage"
                nameKey="categoryName"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent, payload }) => `${name}: ${(percent * 100).toFixed(2)}% (${payload.totalOrders})`}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip
                formatter={(value, name, props) => [
                    `${props.payload.totalOrders} orders (${(value as number).toFixed(2)}%)`,
                    props.payload.categoryName
                ]}
            />
            <Legend />
        </PieChart>
    </ResponsiveContainer>
);

export const ProductSalesChart = ({ data }: { data: ProductSales[] }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ left: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productName" angle={-45} textAnchor="end" height={70} interval={0} tick={{ fontSize: 12 }} />
            <YAxis
                yAxisId="left"
                tickFormatter={(value) => new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(value).replace(/\s/g, '').replace('Rp', '')}
            />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => new Intl.NumberFormat('en-US').format(value)} />
            <Tooltip
                formatter={(value, name) => [
                    name === 'Total Gross Revenue'
                        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value as number)
                        : new Intl.NumberFormat('en-US').format(value as number),
                    name
                ]}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="totalGrossRevenue" fill={COLORS[0]} name="Total Gross Revenue" />
            <Bar yAxisId="right" dataKey="totalQuantity" fill={COLORS[1]} name="Total Quantity" />
        </BarChart>
    </ResponsiveContainer>
);
interface DailySalesData {
    date: string;
    totalSales: number;
    totalOrders: number;
}

export const DailySalesChart = ({ data }: { data: DailySalesData[] }) => {
    // Sort data by date in ascending order
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={sortedData} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval={0}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis
                    yAxisId="left"
                    tickFormatter={(value) => new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(value).replace(/\s/g, '').replace('Rp', '')}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => new Intl.NumberFormat('en-US').format(value)}
                />
                <Tooltip
                    formatter={(value, name) => [
                        name === 'Daily Sales'
                            ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value as number)
                            : new Intl.NumberFormat('en-US').format(value as number),
                        name
                    ]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="totalSales" fill={COLORS[0]} name="Daily Sales" />
                <Line yAxisId="right" type="monotone" dataKey="totalOrders" stroke={COLORS[1]} name="Total Orders" dot={{ r: 4 }} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};
