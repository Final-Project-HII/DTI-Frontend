import React from 'react'
import { Button } from '../../../ui/button'
import { ChevronDown, LayoutGrid } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const CategoryDropdown = () => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Toys'];
  return (

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-blue-600">
          <LayoutGrid className="mr-2 h-5 w-5" />
          Category
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        {categories.map((category, index) => (
          <DropdownMenuItem key={index}>
            <Link href={`/category/${category.toLowerCase()}`}>{category}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CategoryDropdown