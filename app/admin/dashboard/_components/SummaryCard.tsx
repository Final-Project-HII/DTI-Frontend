import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface SummaryCardProps {
    title: string;
    value: number | string;
    percentage?: number;
    isPositive?: boolean;
    showPercentage?: boolean;
    icon?: React.ReactNode;
    className?: string
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, percentage, isPositive, showPercentage = true, icon, className }) => {
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {showPercentage && percentage !== undefined && (
                    <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                        {isPositive ? <ArrowUpIcon className="mr-1 h-4 w-4" /> : <ArrowDownIcon className="mr-1 h-4 w-4" />}
                        {percentage.toFixed(2)}%
                    </p>
                )}
            </CardContent>
        </Card>
    );
};