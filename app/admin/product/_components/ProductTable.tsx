import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ProductTableProps {
    products: Product[];
    currentPage: number;
    pageSize: number;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    isLoading: boolean;
}
interface ProductImage {
    id: number;
    productId: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

interface Product {
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
}

interface ApiResponse {
    content: Product[];
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

export const ProductTable: React.FC<ProductTableProps> = ({
    products,
    currentPage,
    pageSize,
    onEdit,
    onDelete,
    isLoading
}) => {
    if (isLoading) {
        return <TableRow><TableCell colSpan={8}><p>Loading...</p></TableCell></TableRow>;
    }

    return (
        <Table className='p-4'>
            <TableHeader>
                <TableRow className='bg-blue-600 hover:bg-transparent-none'>
                    <TableHead className='text-white'>No</TableHead>
                    <TableHead className='text-white'>Image</TableHead>
                    <TableHead className='text-white'>Name</TableHead>
                    <TableHead className='text-white'>Stock</TableHead>
                    <TableHead className='text-white'>Ordered Qty</TableHead>
                    <TableHead className='text-white'>Status</TableHead>
                    <TableHead className='text-white'>Price</TableHead>
                    <TableHead className='text-white'>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product, index) => (
                    <TableRow key={product.id}>
                        <TableCell>{currentPage * pageSize + index + 1}</TableCell>
                        <TableCell>
                            <div className="bg-white flex items-center justify-center p-1 w-14 h-14 rounded-xl shadow-md">
                                {product.productImages.length > 0 && (
                                    <Image
                                        src={product.productImages[0].imageUrl}
                                        alt={product.name}
                                        // className="w-12 h-12 object-contain rounded"
                                        className={`w-12 h-12 object-contain rounded ${product.totalStock === 0 ? 'grayscale' : ''}`}
                                        // style={{ filter: product.totalStock === 0 ? 'grayscale(100%)' : 'none' }}
                                        width={48}
                                        height={48}
                                    />
                                )}
                            </div>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.totalStock}</TableCell>
                        <TableCell>20</TableCell>
                        <TableCell>
                            {product.totalStock > 0 ? (
                                <Badge className="bg-green-100 text-green-700"> • Available</Badge>
                            ) : (
                                <Badge className="bg-red-100 text-red-700"> • Out of Stock</Badge>
                            )}
                        </TableCell>
                        <TableCell>Rp {product.price.toLocaleString()}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white">
                                    <DropdownMenuItem onClick={() => onEdit(product)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onDelete(product.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};