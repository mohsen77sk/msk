import { MskDateRangeItem, MskDateRange, MskDateRangeKey } from '@msk/shared/utils/datetime';

export type DateRangeKey = Extract<
  MskDateRangeKey,
  'today' | 'lastWeek' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom'
>;
export interface DateRangeItem extends MskDateRangeItem {
  id: DateRangeKey;
}

export interface DateRange extends MskDateRange {
  key?: DateRangeKey;
}
