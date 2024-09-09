import axios from 'axios'
import { ApiResponse, Product } from '@/types/product'
import { Category } from '@/types/category'
import { Warehouse } from '@/types/warehouse'
import { WarehouseFormData } from '@/app/admin/warehouse/components/AddWarehoseForm'

const BASE_URL = 'http://localhost:8080'

onst axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchProducts = async () => {
  const response = await axiosInstance.get("/product");
  return response.data;
};

export const fetchCartItems = async (token: string) => {
  const response = await axiosInstance.get("/carts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.items;
};

export const addToCartApi = async (
  token: string,
  productId: number,
  quantity: number
) => {
  const response = await axiosInstance.post(
    "/cart-items/add",
    {
      productId,
      quantity,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const updateCartItemQuantityApi = async (
  token: string,
  productId: number,
  quantity: number
) => {
  const response = await axiosInstance.put(
    `/cart-items/item/${productId}`,
    { quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const removeCartItemApi = async (token: string, productId: number) => {
  await axiosInstance.delete(`/cart-items/item/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchFilteredProducts = async (
  params: URLSearchParams
): Promise<ApiResponse> => {
  const response = await axiosInstance.get<ApiResponse>(
    `/product?${params.toString()}`
  );
  return response.data;
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const response = await axiosInstance.post("/product/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (
  id: number,
  formData: FormData
): Promise<Product> => {
  const response = await axiosInstance.put(`/product/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/product/delete/${id}`);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>("/category");
  return response.data;
};

export const createCategory = async (name: string): Promise<Category> => {
  const response = await axiosInstance.post("/category/create", { name });
  return response.data;
};

export const updateCategory = async (
  id: number,
  name: string
): Promise<Category> => {
  const response = await axiosInstance.put(`/category/update/${id}`, {
    name,
  });
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/category/delete/${id}`);
};

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get<Order[]>("/orders");
  return response.data;
};


export const getAllWarehouse = async (): Promise<Warehouse[]> => {
  const response = await axios.get(`${BASE_URL}/api/warehouses`)
  return response.data.data
}

export const createWarehouse = async (
  formData: WarehouseFormData
): Promise<Warehouse> => {
  const response = await axios.post(`${BASE_URL}/api/warehouses`, formData)
  return response.data
}

export const updateWarehouse = async (
  id: number,
  formData: WarehouseFormData
): Promise<Category> => {
  const response = await axios.put(`${BASE_URL}/api/warehouses/${id}`, formData)
  return response.data
}

export const deleteWarehouse = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/api/warehouses/${id}`)
}

