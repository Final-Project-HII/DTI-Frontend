import axios from 'axios';
import { ApiResponse, Category, ParsedSlug } from '../types/product';

const BASE_URL = 'http://localhost:8080/api';

export const fetchProducts = async (
    page: string,
    size: string,
    categories: string[],
    sort: string,
    direction: string,
    search: string
): Promise<ApiResponse> => {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', size);
    if (categories.length > 0) {
        params.set('categoryName', categories.join(','));
    }
    if (sort !== "related") {
        params.set('sortBy', sort);
        params.set('sortDirection', direction);
    }
    if (search) params.set('search', search);

    const response = await axios.get<ApiResponse>(`${BASE_URL}/product?${params.toString()}`);
    return response.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await axios.get<Category[]>(`${BASE_URL}/category`);
    return response.data;
};

export function parseSlug(slug: string): ParsedSlug {
    const [id, ...nameParts] = slug.split("_");
    return {
        id,
        name: nameParts.join("_").replace(/-/g, " "),
    };
}

export async function getProductData(slug: string) {
    const { id } = parseSlug(slug);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/product/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }
    return response.json();
}