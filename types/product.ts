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
