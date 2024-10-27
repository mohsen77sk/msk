import { HttpErrorResponse } from '@angular/common/http';

export type MskLookupResponse = MskLookupItem[];

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
  errors: MskErrorResponseItem;
}

export interface MskErrorResponseItem {
  [key: string]: string[];
}

export interface MskLookupItem {
  id: number;
  code: string;
  name: string;
}
