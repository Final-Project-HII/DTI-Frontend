export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }
  
  export interface Order {
    id: number;
    userId: number;
    items: OrderItem[];
    orderDate: string;
    status: string;
    totalAmount: number;
  }