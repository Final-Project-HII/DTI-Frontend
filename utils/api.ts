import axios from "axios";

const API_URL = "http://localhost:8080/api/v1"; // Adjust this to match your backend URL

export const fetchProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const fetchCartItems = async (userId: number) => {
  const response = await axios.get(`${API_URL}/carts/${userId}`);
  return response.data.items;
};

export const addToCartApi = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  const response = await axios.post(`${API_URL}/cart-items/add`, {
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
    `${API_URL}/cart-items/${userId}/item/${productId}`,
    { quantity }
  );
  return response.data;
};

export const removeCartItemApi = async (userId: number, productId: number) => {
  await axios.delete(`${API_URL}/cart-items/${userId}/item/${productId}`);
};
