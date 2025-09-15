import { MatPaginator } from '@angular/material/paginator';
import { MskSort } from './sort.types';

/**
 * MskPagingRequest is a class that encapsulates the parameters needed for paginated requests.
 * It includes pagination details such as page number, page size, sorting and filter information.
 *
 * @example
 * const request = new MskPagingRequest(paginator, sort, { search: 'example', isActive: true });
 */
export class MskPagingRequest {
  page: number;
  pageSize: number;
  sortBy: string;
  [kye: string]: string | number | boolean;

  constructor(page: MatPaginator, sort?: MskSort, filter?: Record<string, unknown>) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.sortBy = sort ? sort.toString() : 'id asc';
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

export function convertToMirzaPagingRequest(params: MskPagingRequest): Record<string, string | number | boolean> {
  const mirzaParams: Record<string, string | number | boolean> = {
    page: params.page,
    take: params.pageSize,
    orderProperty: params.sortBy.split(' ')[0],
    order: params.sortBy.split(' ')[1].toUpperCase(),
  };

  // Add other properties from params if they exist
  Object.keys(params).forEach((key) => {
    if (!['page', 'pageSize', 'sortBy'].includes(key)) {
      if (['string', 'number', 'boolean'].includes(typeof params[key])) {
        mirzaParams[key] = params[key];
      }
    }
  });

  return mirzaParams;
}
