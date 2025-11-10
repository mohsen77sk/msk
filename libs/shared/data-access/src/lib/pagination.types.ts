import { MskPagingResponse } from './response.types';

export const MskPageSizeOptions = [10, 25, 50];

export class MskPageData<T, D = unknown> {
  pageIndex: number;
  pageSize: number;
  total: number;
  items: T[];
  data?: D;

  constructor(input: MskPagingResponse<T>) {
    this.pageIndex = input.page - 1;
    this.pageSize = input.pageSize;
    this.total = input.total;
    this.items = input.items;
    this.data = input['data'] as D;
  }
}

export const EmptyPageData = new MskPageData({
  page: 0,
  pageSize: 0,
  total: 0,
  items: [],
});
