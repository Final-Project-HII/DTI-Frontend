import { useState, useEffect } from 'react';
import { Order } from '@/types/order';

interface MidtransStatus {
  transaction_status: string;
  status_code: string;
  // Add other fields from the Midtrans API response as needed
}

export const useMidtransStatus = (orders: Order[]) => {
  const [statusMap, setStatusMap] = useState<Map<string, MidtransStatus>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      setLoading(true);
      setError(null);
      const newStatusMap = new Map<string, MidtransStatus>();

      try {
        const fetchPromises = orders.map(async (order) => {
          const response = await fetch(`https://api.sandbox.midtrans.com/v2/${order.id}/status`, {
            headers: {
              'Authorization': 'Basic ' + btoa('YOUR-SERVER-KEY:'), // Replace with your actual server key
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: MidtransStatus = await response.json();
          newStatusMap.set(String(order.id), data);  // Convert order.id to string
        });

        await Promise.all(fetchPromises);
        setStatusMap(newStatusMap);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    if (orders.length > 0) {
      fetchStatuses();
    }
  }, [orders]);

  return { 
    statusMap, 
    loading, 
    error,
    getStatus: (orderId: number) => statusMap.get(String(orderId))  // Helper function to get status
  };
};