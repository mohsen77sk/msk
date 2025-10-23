import { DateRange, DateRangeKey } from './filter-date.types';
import { startOfToday, endOfToday, startOfYear, endOfYear, subYears, subDays, Locale } from 'date-fns';
import {
  startOfToday as jalaliStartOfToday,
  endOfToday as jalaliEndOfToday,
  startOfYear as jalaliStartOfYear,
  endOfYear as jalaliEndOfYear,
  subYears as jalaliSubYears,
  subDays as jalaliSubDays,
} from 'date-fns-jalali';

/**
 * Utility to compute date ranges by key and locale.
 */
export class DateRangeFactory {
  /**
   * Compute a DateRange from a key, considering locale.
   * @param key e.g. 'today', 'lastWeek', 'lastMonth', 'thisYear', 'lastYear'
   * @param localeCode e.g. 'fa-IR' for Jalali; defaults to Gregorian
   */
  static fromKey(key: DateRangeKey, locale?: Locale): DateRange {
    const calendarType: 'gregorian' | 'jalali' = locale?.code === 'fa-IR' ? 'jalali' : 'gregorian';
    const { startDate, endDate } = DateRangeFactory.computeRangeByKey(key, calendarType);
    return { key, startDate, endDate };
  }

  private static computeRangeByKey(
    key: DateRangeKey,
    calendar: 'gregorian' | 'jalali',
  ): { startDate: Date | null; endDate: Date | null } {
    const today = new Date();
    const fns =
      calendar === 'jalali'
        ? {
            startOfToday: jalaliStartOfToday,
            endOfToday: jalaliEndOfToday,
            startOfYear: jalaliStartOfYear,
            endOfYear: jalaliEndOfYear,
            subYears: jalaliSubYears,
            subDays: jalaliSubDays,
          }
        : { startOfToday, endOfToday, startOfYear, endOfYear, subYears, subDays };

    switch (key) {
      case 'today':
        return { startDate: fns.startOfToday(), endDate: fns.endOfToday() };
      case 'lastWeek':
        return { startDate: fns.subDays(today, 6), endDate: fns.endOfToday() };
      case 'lastMonth':
        return { startDate: fns.subDays(today, 30), endDate: fns.endOfToday() };
      case 'thisYear':
        return { startDate: fns.startOfYear(today), endDate: fns.endOfYear(today) };
      case 'lastYear':
        return {
          startDate: fns.startOfYear(fns.subYears(today, 1)),
          endDate: fns.endOfYear(fns.subYears(today, 1)),
        };
      default:
        return { startDate: null, endDate: null };
    }
  }
}
