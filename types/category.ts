export interface Category {
    id: number;
    name: string;
    categoryImage: string;
    products: number[];
    createdAt: string;
    updatedAt: string;
}

export interface CategoryRequestDto {
    name: string;
}
export interface ApiResponse {
    content: Product[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}
export interface ProductImage {
    id: number;
    productId: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
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
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}