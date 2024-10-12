// export interface Products {
//   id: number;
//   name: string;
//   price: number;
//   description: string;
//   imageUrl?: string;
// }

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  weight: number;
  totalWeight: number;
}

export interface CartDetails {
  totalPrice: number;
  totalItems: number;
}
