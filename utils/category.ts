import axios from 'axios';
import { Category, ApiResponse } from '@/types/category';

// const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;
const BASE_URL = 'http://localhost:8080/api';
// const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;
export const fetchCategories = async (): Promise<Category[]> => {
    const response = await axios.get<Category[]>(`${BASE_URL}/category`);
    return response.data;
};
export const deleteCategory = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/category/delete/${id}`);
};

export const fetchProducts = async (queryKey: readonly unknown[]): Promise<ApiResponse> => {
    const [_, page, size, category, sort, direction, search] = queryKey as [string, string, string, string, string, string, string];
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', size);
    if (category !== 'all') params.set('categoryName', category);
    if (sort !== "related") {
        params.set('sortBy', sort);
        params.set('sortDirection', direction);
    }
    if (search) params.set('search', search);

    const response = await axios.get<ApiResponse>(`${BASE_URL}/product?${params.toString()}`);
    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/product/delete/${id}`);
};

export const createCategory = async (name: string) => {
    const response = await axios.post(`${BASE_URL}/category/create`, { name });
    return response.data;
};