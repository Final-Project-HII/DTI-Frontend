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

export const useOrders = (
  page: number,
  size: number,
  status?: string,
  startDate?: Date | null,
  endDate?: Date | null
) => {
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
        let url = `${process.env.NEXT_PUBLIC_API_URL}api/orders?page=${page}&size=${size}`;

        // If status is provided and not 'all', use the filtered endpoint
        if (status && status !== "all") {
          url = `${process.env.NEXT_PUBLIC_API_URL}api/orders/filtered?page=${page}&size=${size}`;
        }

        // Add date range parameters if provided
        if (startDate && endDate) {
          url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch orders");
        }
        const data: OrdersResponse = await response.json();
        setOrdersData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, page, size, status, startDate, endDate]);

  return { ordersData, loading, error };
  return { ordersData, loading, error };
};
