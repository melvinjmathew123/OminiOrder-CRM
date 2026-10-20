export declare class GetOrdersFilterDto {
    search?: string;
    financialStatus?: string;
    fulfillmentStatus?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
