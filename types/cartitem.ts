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
  imageUrl?: string;
}
