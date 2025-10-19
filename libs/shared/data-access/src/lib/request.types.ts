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
  [kye: string]: string | number | boolean | Date;

  constructor(page: MatPaginator, sort?: MskSort, filter?: Record<string, unknown>) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.sortBy = sort ? sort.toString() : 'id asc';

    // Add other properties from filter if they exist
    if (!filter) return;
    Object.entries(filter).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      // Trim string values
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed !== '') {
          this[key] = trimmed;
        }
        return;
      }
      // Allow numbers & booleans
      if (typeof value === 'number' || typeof value === 'boolean') {
        this[key] = value;
        return;
      }
      // Allow Date type
      if (value instanceof Date && !isNaN(value.getTime())) {
        this[key] = value.toISOString();
      }
    });
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
  Object.entries(params).forEach(([key, value]) => {
    if (['page', 'pageSize', 'sortBy'].includes(key)) return;
    if (value == null) return;

    if (['string', 'number', 'boolean'].includes(typeof value)) {
      mirzaParams[key] = value as string | number | boolean;
    } else if (value instanceof Date) {
      mirzaParams[key] = value.toISOString();
    }
  });

  return mirzaParams;
}
