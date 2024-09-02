
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export const useFetchProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const productResponse = await axiosInstance.get('/product')
            return productResponse;
        }
    })
}