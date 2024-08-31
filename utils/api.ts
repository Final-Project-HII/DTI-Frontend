import axios from "axios";
import { ApiResponse, Product } from "@/types/product";
import { Category } from "@/types/category";

const BASE_URL = "http://localhost:8080/api/v1";

export const fetchProducts = async () => {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data;
};

export const fetchCartItems = async (userId: number) => {
  const response = await axios.get(`${BASE_URL}/carts/${userId}`);
  return response.data.items;
};

export const addToCartApi = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  const response = await axios.post(`${BASE_URL}/cart-items/add`, {
    id: userId,
    productId,
    quantity,
  });
  return response.data;
};

export const updateCartItemQuantityApi = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  const response = await axios.put(
    `${BASE_URL}/cart-items/${userId}/item/${productId}`,
    { quantity }
  );
  return response.data;
};

export const removeCartItemApi = async (userId: number, productId: number) => {
  await axios.delete(`${BASE_URL}/cart-items/${userId}/item/${productId}`);
}; // <-- Added missing closing brace here

// Renamed this function to avoid duplicate function name
export const fetchFilteredProducts = async (
  params: URLSearchParams
): Promise<ApiResponse> => {
  const response = await axios.get<ApiResponse>(
    `${BASE_URL}/product?${params.toString()}`
  );
  return response.data;
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const response = await axios.post(`${BASE_URL}/product/create`, formData, {
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
  const response = await axios.put(
    `${BASE_URL}/product/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/product/delete/${id}`);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`${BASE_URL}/category`);
  return response.data;
};

export const createCategory = async (name: string): Promise<Category> => {
  const response = await axios.post(`${BASE_URL}/category/create`, { name });
  return response.data;
};

export const updateCategory = async (
  id: number,
  name: string
): Promise<Category> => {
  const response = await axios.put(`${BASE_URL}/category/update/${id}`, {
    name,
  });
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/category/delete/${id}`);
};
