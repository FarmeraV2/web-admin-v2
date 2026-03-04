export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

/** Backend standard envelope: { statusCode, message, data } */
export interface BackendResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

/** Pagination meta from backend */
export interface BackendPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** Paginated list from backend */
export interface BackendPaginatedData<T> {
  data: T[];
  pagination: BackendPagination;
}
