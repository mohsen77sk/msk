import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

export class MskPagingRequest {
  page: number;
  pageSize: number;
  sortBy: string;
  [kye: string]: string | number | boolean;

  constructor(page: MatPaginator, sort?: MatSort, filter?: Record<string, unknown>) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.sortBy = sort ? `${sort.active} ${sort.direction}` : 'id asc';
    // Add other properties from filter if they exist
    if (filter) {
      Object.keys(filter).forEach((key) => {
        if (filter[key] !== undefined && filter[key] !== null) {
          if (typeof filter[key] === 'string' && filter[key].trim() !== '') {
            this[key] = filter[key].trim();
          } else if (typeof filter[key] === 'number' || typeof filter[key] === 'boolean') {
            this[key] = filter[key];
          }
        }
      });
    }
  }
}
