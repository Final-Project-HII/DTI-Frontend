import { DateRange } from "react-day-picker";

export interface Warehouse {
    id: number;
    name: string;
}

export interface StockMutationJournal {
    id: number;
    stockMutationId: number;
    productName: string;
    warehouseName: string;
    anotherWarehouse: string;
    beginningStock: number;
    endingStock: number;
    mutationType: 'IN' | 'OUT';
    quantity: number;
    createdAt: string;
    uuid: number;
    loginWarehouseId: number;
}

export interface StockMutationJournalResponse {
    statusCode: number;
    message: string;
    success: boolean;
    data: {
        content: StockMutationJournal[];
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
    };
}

export interface ProductSummary {
    productId: number;
    productName: string;
    totalAddition: number;
    totalReduction: number;
    endingStock: number;
}

export interface SummaryCardProps {
    title: string;
    value: number;
    percentage?: number;
    isPositive?: boolean;
    showPercentage?: boolean;
}

export interface StockReportResponse {
    summary: {
        month: string;
        warehouseId: number;
        warehouseName: string;
        productSummaries: {
            content: ProductSummary[];
            totalPages: number;
            totalElements: number;
            size: number;
            number: number;
        };
        totalAddition: number;
        totalReduction: number;
        endingStock: number;
    };
}