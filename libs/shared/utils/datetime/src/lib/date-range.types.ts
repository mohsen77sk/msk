export type MskDateRangeKey =
  | 'today'
  | 'yesterday'
  | 'lastWeek'
  | 'lastMonth'
  | 'last3Month'
  | 'last6Month'
  | 'thisYear'
  | 'lastYear'
  | 'custom';

export interface MskDateRangeItem {
  id: MskDateRangeKey;
  name: string;
}

export interface MskDateRange {
  startDate: Date | null;
  endDate: Date | null;
  key?: MskDateRangeKey;
}
