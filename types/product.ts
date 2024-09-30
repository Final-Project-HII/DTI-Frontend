export interface ProductImage {
  id: number
  productId: number
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  weight: number
  categoryId: number
  categoryName: string
  productImages: ProductImage[]
  createdAt: string
  updatedAt: string
}

export interface City {
  id: number
  name: string
}

export interface Address {
  id: number
  name: string
  phoneNumber: string
  addressLine: string
  city: City
  postalCode: string
  lat: number
  lon: number
  isActive: boolean
}

export interface ApiResponse {
  content: Product[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  empty: boolean
}

export interface ApiResponseAddress {
  content: Address[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  empty: boolean
}

// Stock Mutation
export interface StockMutationResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: StockMutationData;
}

export interface StockMutationData {
  totalElements: number;
  totalPages: number;
  size: number;
  content: StockMutation[];
}

export interface StockMutation {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  originWarehouseId: number;
  originWarehouseName: string;
  destinationWarehouseId: number;
  destinationWarehouseName: string;
  quantity: number;
  status: 'COMPLETED' | 'REQUESTED' | 'IN_TRANSIT' | 'CANCELLED' | 'APPROVED';
  loginWarehouseId: number;
  mutationType: 'MANUAL';
  remarks: string | null;
  requestedBy: string;
  handledBy: string | null;
  createdAt: string;
  updatedAt: string;
}
