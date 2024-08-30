import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

interface ProductTableProps {
    products: Product[];
    currentPage: number;
    pageSize: number;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    isPending: boolean;
}

interface Product {
    id: number;
    name: string;
    price: number;
    productImages: { imageUrl: string }[];
}

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    currentPage,
    pageSize,
    onEdit,
    onDelete,
    isPending
}) => {
    const formatToRupiah = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Ordered Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isPending ? (
                    <TableRow>
                        <TableCell colSpan={8}><p>Loading...</p></TableCell>
                    </TableRow>
                ) : (
                    products.map((product, index) => (
                        <TableRow key={product.id}>
                            <TableCell>{currentPage * pageSize + index + 1}</TableCell>
                            <TableCell>
                                {product.productImages.length > 0 && (
                                    <img
                                        src={product.productImages[0].imageUrl}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                )}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>100</TableCell>
                            <TableCell>20</TableCell>
                            <TableCell>
                                <Badge className="bg-green-100 text-green-700"> • Available</Badge>
                            </TableCell>
                            <TableCell>{formatToRupiah(product.price)}</TableCell>
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
                    ))
                )}
            </TableBody>
        </Table>
    );
};

export default ProductTable;