export interface Result {
    success: boolean;
    count?: number;
    data: object;
}
export interface PaginationInfo {
    page: number;
    limit: number;
}
export interface PaginationResult {
    next?: PaginationInfo;
    prev?: PaginationInfo;
}
export interface AdvancedResult extends Result {
    pagination: PaginationResult;
}
