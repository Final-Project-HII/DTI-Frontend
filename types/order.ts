export interface Order {
  id: number;
  username : string,
  invoiceId: string;
  userId: number;
  status: string;
  originalAmount: number;
  finalAmount: number;
  totalWeight: number;
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  warehouseId: number;
  warehouseName: string;
  addressId: number;
  courierId: number;
  courierName: string;
  originCity: string;
  destinationCity: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}