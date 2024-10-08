import React from "react";

const PaymentPageSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
      <div className="mt-8 space-y-2">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="mt-4 h-12 bg-gray-200 rounded w-1/3"></div>
    </div>
  );
};

export default PaymentPageSkeleton;