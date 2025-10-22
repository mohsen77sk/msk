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
  [key: string]: string | number | boolean;

  constructor(input: { page: number; pageSize: number; sortBy: string; filter: Record<string, unknown> }) {
    this.page = input['page'] ?? 0;
    this.pageSize = input['pageSize'] ?? 10;
    this.sortBy = input['sortBy'] ?? 'id asc';

    // Add other properties from filter if they exist
    if (!input.filter) return;
    Object.entries(input.filter).forEach(([key, value]) => {
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
      // Allow Date range type
      if (key === 'dateRange' && isDateRangeValue(value)) {
        const { startDate, endDate } = value;
        if (isValidDate(startDate)) this['dateFrom'] = startDate.toISOString();
        if (isValidDate(endDate)) this['dateTo'] = endDate.toISOString();
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
    }
  });

  return mirzaParams;
}

// -----------------------------------------------------------------------------------------------------
// Type guards
// -----------------------------------------------------------------------------------------------------

function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !isNaN(d.getTime());
}

function isDateRangeValue(v: unknown): v is { startDate: Date | null; endDate: Date | null } {
  return !!v && typeof v === 'object' && 'startDate' in v && 'endDate' in v;
}
