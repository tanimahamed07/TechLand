// Common API Response Types

// Generic Success Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// Generic Paginated Response
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Response
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Pagination Params
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Sort Params
export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Common Query Params
export interface QueryParams extends PaginationParams, SortParams {
  search?: string;
}
