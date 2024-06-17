export interface MskPagingResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MskErrorResponse {
  message: string;
  errors: [
    {
      [key: string]: string;
    }
  ];
}
