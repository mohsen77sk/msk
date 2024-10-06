import { HttpErrorResponse } from '@angular/common/http';

export interface MskPagingResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MskHttpErrorResponse extends HttpErrorResponse {
  error: MskErrorResponse;
}

export interface MskErrorResponse {
  message: string;
  errors: MskErrorResponseItem[];
}

export interface MskErrorResponseItem {
  [key: string]: string[];
}
