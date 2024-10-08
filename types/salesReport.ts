export interface Warehouse {
    id: number;
    name: string;
}

export interface SalesSummary {
    month: string;
    warehouseId: number;
    warehouseName: string;
    totalGrossRevenue: number;
    totalOrders: number;
}

export interface CategorySales {
    month: string;
    warehouseId: number;
    warehouseName: string;
    categoryId: number;
    categoryName: string;
    totalGrossRevenue: number;
    totalOrders: number;
}

export interface ProductSales {
    month: string;
    warehouseId: number;
    warehouseName: string;
    productId: number;
    productName: string;
    categoryId: number;
    categoryName: string;
    totalGrossRevenue: number;
    totalQuantity: number;
    productPrice: number;
}

export interface SalesDetail {
    id: number;
    invoiceId: string;
    userId: number;
    warehouseId: number;
    addressId: number;
    items: Array<{
        id: number;
        productId: number;
        productName: string;
        categoryId: number;
        categoryName: string;
        quantity: number;
        price: number;
    }>;
    orderDate: string;
    status: string;
    originalAmount: number;
    finalAmount: number;
    totalWeight: number;
    totalQuantity: number;
    courierId: number;
    shippingCost: number;
    warehouseName: string;
    courierName: string;
    originCity: string;
    destinationCity: string;
    paymentMethod: string | null;
    loginWarehouseId: number;
    month: string;
}

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    success: boolean;
    data: {
        content: T[];
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

export interface SummaryCardProps {
    title: string;
    value: number | string;
    percentage?: number;
    isPositive?: boolean;
    showPercentage?: boolean;
}