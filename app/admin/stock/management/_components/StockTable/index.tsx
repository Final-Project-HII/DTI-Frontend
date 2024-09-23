import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus, Edit, HousePlus } from 'lucide-react';
import Image from 'next/image';

interface ProductTableProps {
    products: Product[];
    currentPage: number;
    pageSize: number;
    onAddStock: (product: Product) => void;
    onUpdateStock: (stock: Stock) => void;
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
    stocks: Stocks[];
    createdAt: string;
    updatedAt: string;
}

interface Stocks {
    id: number;
    warehouseId: number;
    warehouseName: string;
    quantity: number;
}

interface Stock {
    id: number;
    productId: number;
    warehouseId: number;
    quantity: number;
}

export const ProductTable: React.FC<ProductTableProps> = ({
    products,
    currentPage,
    pageSize,
    onAddStock,
    onUpdateStock,
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
                                        className="w-12 h-12 object-contain rounded"
                                        style={{ filter: product.totalStock === 0 ? 'grayscale(100%)' : 'none' }}
                                        width={48}
                                        height={48}
                                    />
                                )}
                            </div>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.totalStock}</TableCell>
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
                                    <DropdownMenuItem onClick={() => onAddStock(product)}>
                                        <HousePlus className="mr-2 h-4 w-4" />
                                        <span>Add Stock</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onUpdateStock({ id: 0, productId: product.id, warehouseId: 0, quantity: 0 })}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Update Stock</span>
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