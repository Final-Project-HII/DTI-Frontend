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
  status: string,
  warehouseId: string,
  startDate: string,
  endDate: string
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
        const queryParams = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          ...(status && status !== "all" && { status }),
          ...(warehouseId && { warehouse: warehouseId }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        });

        const url = `${process.env.NEXT_PUBLIC_API_URL}api/orders/admin?${queryParams}`;

        console.log("Fetching orders from URL:", url);

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

        const data = await response.json();
        console.log("Received data:", data);
        setOrdersData(data);
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
  }, [session, page, size, status, warehouseId, startDate, endDate]);

  return { ordersData, loading, error };
};
