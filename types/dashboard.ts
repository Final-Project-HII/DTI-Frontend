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

export interface ProductSummary {
    productId: number;
    productName: string;
    totalAddition: number;
    totalReduction: number;
    endingStock: number;
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
    };
    summary?: {
        totalAddition: number;
        totalReduction: number;
        endingStock: number;
        productSummaries: {
            content: ProductSummary[];
        };
    };
}

export interface CategorySales {
    month: string;
    warehouseId: number | null;
    warehouseName: string | null;
    categoryId: number;
    categoryName: string;
    totalGrossRevenue: number;
    totalOrders: number;
}

export interface ProductSales {
    month: string | null;
    warehouseId: number | null;
    warehouseName: string;
    productId: number | null;
    productName: string;
    categoryId: number | null;
    categoryName: string;
    totalGrossRevenue: number;
    totalQuantity: number;
    productPrice: number;
}

export interface DailySales {
    id: number;
    invoiceId: string;
    userId: number;
    warehouseId: number;
    orderDate: string;
    finalAmount: number;
    totalQuantity: number;
    addressId: number;
    items: Array<{
        id: number;
        orderId: number | null;
        productId: number;
        productName: string;
        categoryId: number;
        categoryName: string;
        quantity: number;
        price: number;
        productSnapshot: any;
    }>;
    status: string;
    originalAmount: number;
    totalWeight: number;
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

export interface ProductSummaryData {
    productName: string;
    totalAddition: number;
    totalReduction: number;
    endingStock: number;
}