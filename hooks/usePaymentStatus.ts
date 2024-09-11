import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const usePaymentStatus = (orderId: number) => {
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/payments/status/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment status');
        }

        const data = await response.json();
        setTransactionStatus(data.transaction_status);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [orderId, session]);

  return { transactionStatus, loading, error };
};