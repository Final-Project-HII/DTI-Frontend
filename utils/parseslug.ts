// utils.ts
export interface ParsedSlug {
    id: string;
    name: string;
  }
  
  // Function to parse the slug
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
      createdAt: string;
      updatedAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
  }
  