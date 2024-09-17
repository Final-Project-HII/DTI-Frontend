import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StockMutation {
    id: number;
    productName: string;
    originWarehouseName: string;
    destinationWarehouseName: string;
    quantity: number;
    status: string;
    createdAt: string;
}

interface StockMutationTableProps {
    stockMutations: StockMutation[];
    onProcess: (id: number) => void;
    isLoading: boolean;
}

export function StockMutationTable({ stockMutations, onProcess, isLoading }: StockMutationTableProps) {
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Origin Warehouse</TableHead>
                    <TableHead>Destination Warehouse</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {stockMutations.map((mutation) => (
                    <TableRow key={mutation.id}>
                        <TableCell>{mutation.id}</TableCell>
                        <TableCell>{mutation.productName}</TableCell>
                        <TableCell>{mutation.originWarehouseName}</TableCell>
                        <TableCell>{mutation.destinationWarehouseName}</TableCell>
                        <TableCell>{mutation.quantity}</TableCell>
                        <TableCell>
                            <Badge >
                                {mutation.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{new Date(mutation.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                            {mutation.status === 'REQUESTED' && (
                                <Button onClick={() => onProcess(mutation.id)} size="sm">
                                    Process
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}