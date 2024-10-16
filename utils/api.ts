import axios, { AxiosError } from 'axios'
import {
  Address,
  ApiResponse,
  ApiResponseAddress,
  Products,
} from '@/types/product'
import { Category } from '@/types/category'
import { Warehouse } from '@/types/warehouse'
import { WarehouseFormData } from '@/app/admin/warehouse/components/AddWarehoseForm'
import { Order, OrderItem } from '@/types/order'
import { useSession } from 'next-auth/react'
import { AddressFormData } from '@/app/(user)/checkout/_components/UpdateAddressForm'
import { AdminFormData } from '@/app/admin/admin-management/_components/AdminTable/components/DataTable/components/AddAdminForm'
import { CartItem } from '@/types/cartitem'
import { InfoForm } from '@/app/(user)/profile/components/ProfilePage'

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`

export const BASE_URL_DEV = `http://localhost:8080/api`

const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const fetchProducts = async () => {
  const response = await axiosInstance.get('/product')
  return response.data
}

export const fetchProductDetails = async (
  productId: number
): Promise<Products> => {
  try {
    const response = await axiosInstance.get<Products>(`/product/${productId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching product details:', error)
    throw error
  }
}

export const fetchCartItems = async (token: string) => {
  const response = await axiosInstance.get('/carts', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const items = response.data.items

  const totalPrice = items.reduce(
    (sum: number, item: CartItem) => sum + item.totalPrice,
    0
  )
  const totalItems = items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  )

  return {
    items,
    totalPrice,
    totalItems,
  }
}

export const addToCartApi = async (
  token: string,
  productId: number,
  quantity: number
) => {
  const response = await axiosInstance.post(
    '/cart-items/add',
    {
      productId,
      quantity,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}

export const updateCartItemQuantityApi = async (
  token: string,
  productId: number,
  quantity: number
) => {
  const response = await axiosInstance.put(
    `/cart-items/item/${productId}`,
    { quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}

export const removeCartItemApi = async (token: string, productId: number) => {
  await axiosInstance.delete(`/cart-items/item/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const fetchFilteredProducts = async (
  params: URLSearchParams
): Promise<ApiResponse> => {
  const response = await axiosInstance.get<ApiResponse>(
    `/product?${params.toString()}`
  )
  return response.data
}

export const createProduct = async (formData: FormData): Promise<Products> => {
  const response = await axiosInstance.post('/product/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const updateProduct = async (
  id: number,
  formData: FormData
): Promise<Products> => {
  const response = await axiosInstance.put(`/product/update/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const deleteProduct = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/product/delete/${id}`)
}

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>('/category')
  return response.data
}

export const createCategory = async (name: string): Promise<Category> => {
  const response = await axiosInstance.post('/category/create', { name })
  return response.data
}

export const updateCategory = async (
  id: number,
  name: string
): Promise<Category> => {
  const response = await axiosInstance.put(`/category/update/${id}`, {
    name,
  })
  return response.data
}

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/category/delete/${id}`)
}

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get<Order[]>('/orders')
  return response.data
}

export const createOrder = async (): Promise<OrderItem> => {
  try {
    const response = await axios.post(BASE_URL)
    return response.data
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export const getOrder = async (orderId: number): Promise<Order> => {
  try {
    const response = await axios.get<Order>(`${BASE_URL}/${orderId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
}

export const getAllWarehouse = async (
  name: string,
  cityName: string | undefined,
  page: string,
  size: string,
  token: string
): Promise<any> => {
  const params = new URLSearchParams()
  params.set('page', page)
  params.set('size', size)
  if (name) {
    params.set('name', name)
  }
  if (cityName) {
    params.set('cityName', cityName)
  }
  try {
    const response = await axios.get<any>(
      `${BASE_URL}/warehouses?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data.data
  } catch (error) {
    console.error('Error fetching warehouse data:', error)
    throw error
  }
}

export const createWarehouse = async (
  formData: WarehouseFormData,
  token: string
): Promise<Warehouse> => {
  const response = await axios.post(`${BASE_URL}/warehouses`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const updateWarehouse = async (
  id: number,
  formData: WarehouseFormData,
  token: string
): Promise<Category> => {
  const response = await axios.put(`${BASE_URL}/warehouses/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const deleteWarehouse = async (
  id: number,
  token: string
): Promise<void> => {
  await axios.delete(`${BASE_URL}/warehouses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getAllAddress = async (
  token: string,
  addressLine: string,
  page: string,
  size: string
): Promise<any> => {
  const params = new URLSearchParams()
  params.set('page', page)
  params.set('size', size)

  if (addressLine) {
    params.set('addressLine', addressLine)
  }

  try {
    const response = await axios.get<any>(
      `${BASE_URL}/addresses?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
    )
    return response.data.data
  } catch (error) {
    console.error('Error fetching addresses:', error)
    throw error
  }
}

export const deleteAddresses = async (
  id: number,
  token: string
): Promise<void> => {
  await axios.delete(`${BASE_URL}/addresses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const updateAddress = async (
  formData: AddressFormData,
  id: number,
  token: string
): Promise<Address> => {
  const response = await axios.put(`${BASE_URL}/addresses/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const createAddress = async (
  formData: AddressFormData,
  token: string
): Promise<Address> => {
  const response = await axios.post(`${BASE_URL}/addresses`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const toogleActiveAddress = async (
  id: number,
  token: string
): Promise<any> => {
  const response = await axios.put(
    `${BASE_URL}/addresses/change-primary-address/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}

export const getActiveAddress = async (token: string): Promise<any> => {
  try {
    const response = await axios.get<any>(
      `${BASE_URL}/addresses/active-address`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 400) {
        return null
      }
    }

    console.error('Error fetching active address:', error)
    throw error
  }
}

export const getAllUser = async (
  email: string,
  role: string | undefined,
  page: string,
  size: string,
  token: string
): Promise<any> => {
  const params = new URLSearchParams()
  params.set('page', page)
  params.set('size', size)
  if (email) {
    params.set('email', email)
  }
  if (role) {
    params.set('role', role)
  }
  try {
    const response = await axios.get<any>(
      `${BASE_URL}/users?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data.data
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}

export const toogleUserActiveStatus = async (
  id: number,
  token: string
): Promise<any> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/users/toggle-active-user/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error toggling user active status:', error)
    throw error
  }
}

export const createNewAdmin = async (
  formData: AdminFormData,
  token: string
): Promise<any> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users/register-admin`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error creating new admin:', error)
    throw error
  }
}

export const updateAdmin = async (
  formData: AdminFormData,
  token: string
): Promise<any> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/users/update-admin`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error updating admin:', error)
    throw error
  }
}

export const getProfileData = async (token: string): Promise<any> => {
  try {
    const response = await axios.get<any>(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching profile data:', error)
    throw error
  }
}

export const updateProfile = async (
  formData: InfoForm,
  token: string
): Promise<any> => {
  const response = await axios.put(`${BASE_URL}/users/profile`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const updateAvatar = async (
  formData: any,
  token: string
): Promise<any> => {
  const response = await axios.put(`${BASE_URL}/users/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const getShippingData = async (token: string): Promise<any> => {
  try {
    const response = await axios.get<any>(`${BASE_URL}/couriers`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching shipping data:', error)
    throw error
  }
}

export const resetPassword = async (formData: any): Promise<any> => {
  const response = await axios.post(
    `${BASE_URL}/users/set-password`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const changeEmail = async (
  formData: any,
  token: string
): Promise<any> => {
  const response = await axios.put(`${BASE_URL}/users/change-email`, formData, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  })
  return response.data
}
