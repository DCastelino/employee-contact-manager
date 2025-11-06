export * from './employee.model';
export * from './createemployeedto.model';
export * from './updateemployeedto.model';
export * from './company.model';

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
}

export interface ErrorResponse {
    message: string;
    details?: Record<string, string[]>;
}