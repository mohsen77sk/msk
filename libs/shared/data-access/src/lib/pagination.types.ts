import { MskPagingResponse } from './response.types';

export const MskPageSizeOptions = [10, 25, 50];

export class MskPagination {
  pageIndex: number;
  pageSize: number;
  total: number;

  constructor(input: MskPagingResponse<unknown>) {
    this.pageIndex = input.page - 1;
    this.pageSize = input.pageSize;
    this.total = input.total;
  }
}
