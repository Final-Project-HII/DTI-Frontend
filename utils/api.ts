import axios from 'axios'
import { ApiResponse, Product } from '@/types/product'
import { Category } from '@/types/category'
import { Warehouse } from '@/types/warehouse'
import { WarehouseFormData } from '@/app/admin/warehouse/components/AddWarehoseForm'

const BASE_URL = 'http://localhost:8080'

export const fetchProducts = async (
  params: URLSearchParams
): Promise<ApiResponse> => {
  const response = await axios.get<ApiResponse>(
    `${BASE_URL}/product?${params.toString()}`
  )
  return response.data
}

export const createProduct = async (formData: FormData): Promise<Product> => {
  const response = await axios.post(`${BASE_URL}/product/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const updateProduct = async (
  id: number,
  formData: FormData
): Promise<Product> => {
  const response = await axios.put(
    `${BASE_URL}/product/update/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/product/delete/${id}`)
}

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`${BASE_URL}/category`)
  return response.data
}

export const createCategory = async (name: string): Promise<Category> => {
  const response = await axios.post(`${BASE_URL}/category/create`, { name })
  return response.data
}

export const updateCategory = async (
  id: number,
  name: string
): Promise<Category> => {
  const response = await axios.put(`${BASE_URL}/category/update/${id}`, {
    name,
  })
  return response.data
}

export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/category/delete/${id}`)
}

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
