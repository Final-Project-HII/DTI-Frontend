import { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import { useSession } from 'next-auth/react';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/orders', {
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  return { orders, loading, error };
};