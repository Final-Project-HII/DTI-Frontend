import React from 'react'
import { Button } from '../../../ui/button'
import { ChevronDown, LayoutGrid } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const BASE_URL = 'http://localhost:8080/api';
interface Category {
  id: number;
  name: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`${BASE_URL}/category`);
  return response.data;
};

const CategoryDropdown = () => {
  const { data: categories, isLoading, error } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories: {error.message}</div>;

  return (

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-sky-600 font-bold">
          <LayoutGrid className="mr-2 h-5 w-5" />
          Category
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        {categories?.map((category) => (
          <DropdownMenuItem key={category.id}>
            <Link href={`/product?page=0&category=${category.name}`}>{category.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CategoryDropdown