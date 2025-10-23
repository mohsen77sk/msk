export type DateRangeKey = 'today' | 'lastWeek' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom';

export interface DateRangeItem {
  id: DateRangeKey;
  name: string;
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
  key?: DateRangeKey;
}
