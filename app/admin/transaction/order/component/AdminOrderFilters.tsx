import React, { useState } from 'react';

interface OrderFilterProps {
  onFilterChange: (status: string, startDate: Date | null, endDate: Date | null) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(
      status,
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex items-center space-x-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="confirmation">Confirmation</option>
          <option value="process">Process</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default OrderFilter;