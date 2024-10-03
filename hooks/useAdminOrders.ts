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

export const useAdminOrders = (
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
    const fetchAdminOrders = async () => {
      if (!session || session.user.role !== "ADMIN") {
        setLoading(false);
        setError(new Error("Unauthorized access"));
        return;
      }

      try {
        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_API_URL}api/orders/admin/all?page=${page}&size=${size}`;

        if (status && status !== "all") {
          url = `${process.env.NEXT_PUBLIC_API_URL}api/orders/admin/filtered?page=${page}&size=${size}&status=${status}`;
        }

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
          throw new Error(errorData.message || "Failed to fetch admin orders");
        }
        const content: OrdersResponse = await response.json();
        setOrdersData(content);
        setError(null);
      } catch (err) {
        console.error("Error fetching admin orders:", err);
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminOrders();
  }, [session, page, size, status, startDate, endDate]);

  return { ordersData, loading, error };
};