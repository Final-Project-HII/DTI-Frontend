export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Products {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: number;
  categoryId: number;
  categoryName: string;
  totalStock: number;
  productImages: ProductImage[];
  createdAt: string;
  updatedAt: string;
  onEdit: (product: Products) => void;
  onDelete: (id: number) => void;
}

export interface City {
  id: number;
  name: string;
}

export interface Address {
  id: number;
  name: string;
  phoneNumber: string;
  addressLine: string;
  city: City;
  postalCode: string;
  lat: number;
  lon: number;
  isActive: boolean;
}

export interface ApiResponse {
  content: Products[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  empty: boolean;
}

export interface ApiResponseAddress {
  content: Address[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  empty: boolean;
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

export interface Category {
  id: number;
  name: string;
}


export interface ParsedSlug {
  id: string;
  name: string;
}

export function parseSlug(slug: string): ParsedSlug {
  const [id, ...nameParts] = slug.split("_");
  return {
    id,
    name: nameParts.join("_").replace(/-/g, " "),
  };
}

export interface ProductDataResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: number;
  categoryId: number;
  categoryName: string;
  totalStock: number;
  productImages: {
    id: number;
    productId: number;
    imageUrl: string;
    name: string;
    description: string;
    price: number;
    weight: number;
    categoryId: number;
    categoryName: string;
    totalStock: number;
    productImages: {
      id: number;
      productId: number;
      imageUrl: string;
      createdAt: string;
      updatedAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetailProps {
  product: ProductDataResponse;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: number;
  categoryId: number;
  categoryName: string;
  totalStock: number;
  productImages: ProductImage[];
  createdAt: string;
  updatedAt: string;
  onEdit: (product: Products) => void;
  onDelete: (id: number) => void;
}