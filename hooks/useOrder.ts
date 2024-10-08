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
  status: string,
  date: Date | null
) => {
  const [ordersData, setOrdersData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.accessToken) {
        setLoading(false);
        setError(new Error("User not authenticated"));
        return;
      }

      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          ...(status && { status }),
          ...(date && { date: date.toISOString().split('T')[0] }),
        });

        const url = `${process.env.NEXT_PUBLIC_API_URL}api/orders?${queryParams}`;

        console.log("Fetching orders from URL:", url);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Received data:", data);
        setOrdersData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, page, size, status, date]);

  return { ordersData, loading, error };
};