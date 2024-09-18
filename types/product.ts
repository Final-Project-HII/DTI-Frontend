export interface ProductImage {
  id: number
  productId: number
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface Product {
<<<<<<< HEAD
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
=======
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
>>>>>>> 0b70d5d3c0eab3615fa44ad5f2795f0f8fa80bef
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
