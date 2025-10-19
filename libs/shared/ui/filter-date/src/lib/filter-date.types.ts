export type FilterKey = 'today' | 'lastWeek' | 'lastMonth' | 'thisYear' | 'lastYear';

export interface FilterItem {
  id: FilterKey;
  name: string;
}

export interface DateChangeOutput {
  startDate: Date | null;
  endDate: Date | null;
}
