import { HttpErrorResponse } from '@angular/common/http';

export type MskLookupResponse = MskLookupItem[];

export interface MskPagingResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  [key: string]: unknown;
}

export interface MskHttpErrorResponse extends HttpErrorResponse {
  error: MskErrorResponse;
}

export interface MskErrorResponse {
  message: string;
  errors?: MskErrorResponseItem;
}

export interface MskErrorResponseItem {
  [key: string]: string[];
}

export interface MskLookupItem {
  id: number | string;
  code: string;
  name: string;
}
