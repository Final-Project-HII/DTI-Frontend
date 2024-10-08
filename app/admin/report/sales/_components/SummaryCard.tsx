import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import { SummaryCardProps } from '@/types/salesReport';

export const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    percentage,
    isPositive,
    showPercentage = true
}) => {
    return (
        <div className={`p-4 rounded-lg shadow-md ${showPercentage ? (isPositive ? 'bg-blue-50' : 'bg-red-50') : 'bg-gray-50'}`}>
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <div className="flex items-baseline mt-4">
                <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                {showPercentage && percentage !== undefined && (
                    <p className={`ml-2 flex items-baseline text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ?
                            <ArrowUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" /> :
                            <ArrowDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                        }
                        <span className="sr-only">{isPositive ? 'Increased' : 'Decreased'} by</span>
                        {percentage.toFixed(2)}%
                    </p>
                )}
            </div>
        </div>
    );
};