import { MskPagingResponse } from './response.types';

export const MskPageSizeOptions = [10, 25, 50];

export class MskPageData<T> {
  pageIndex: number;
  pageSize: number;
  total: number;
  items: T[];

  constructor(input: MskPagingResponse<T>) {
    this.pageIndex = input.page - 1;
    this.pageSize = input.pageSize;
    this.total = input.total;
    this.items = input.items;
  }
}

export const EmptyPageData = new MskPageData({
  page: 0,
  pageSize: 0,
  total: 0,
  items: [],
});
