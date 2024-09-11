import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Order } from "@/types/order";

interface OrdersResponse {
  content: Order[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const useOrders = (page: number, size: number) => {
  const [ordersData, setOrdersData] = useState<OrdersResponse | null>(null);
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
        const response = await fetch(`http://localhost:8080/api/orders?page=${page}&size=${size}`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data: OrdersResponse = await response.json();
        setOrdersData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, page, size]);

  return { ordersData, loading, error };
};