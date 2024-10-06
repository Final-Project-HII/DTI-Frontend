import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Order } from "@/types/order";

interface OrdersResponse {
  data: {
    content: Order[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
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
        const queryParams = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          ...(status && status !== "all" && { status }),
          ...(startDate && { startDate: startDate.toISOString() }),
          ...(endDate && { endDate: endDate.toISOString() }),
        });

        const url = `${process.env.NEXT_PUBLIC_API_URL}api/orders?${queryParams}`;

        console.log("Fetching orders from URL:", url); // For debugging

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", response.status, errorText);
          throw new Error(
            `Failed to fetch orders: ${response.status} ${response.statusText}`
          );
        }

        const data: OrdersResponse = await response.json();
        console.log("Received data:", data); // For debugging
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
};
