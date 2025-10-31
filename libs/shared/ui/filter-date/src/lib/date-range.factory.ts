import { DateRange, DateRangeKey } from './filter-date.types';
import {
  startOfDay,
  endOfDay,
  startOfToday,
  endOfToday,
  startOfYear,
  endOfYear,
  subYears,
  subDays,
  Locale,
} from 'date-fns';
import {
  startOfDay as jalaliStartOfDay,
  endOfDay as jalaliEndOfDay,
  startOfToday as jalaliStartOfToday,
  endOfToday as jalaliEndOfToday,
  startOfYear as jalaliStartOfYear,
  endOfYear as jalaliEndOfYear,
  subYears as jalaliSubYears,
  subDays as jalaliSubDays,
} from 'date-fns-jalali';

const CalendarUtils = {
  gregorian: {
    startOfDay,
    endOfDay,
    startOfToday,
    endOfToday,
    startOfYear,
    endOfYear,
    subYears,
    subDays,
  },
  jalali: {
    startOfDay: jalaliStartOfDay,
    endOfDay: jalaliEndOfDay,
    startOfToday: jalaliStartOfToday,
    endOfToday: jalaliEndOfToday,
    startOfYear: jalaliStartOfYear,
    endOfYear: jalaliEndOfYear,
    subYears: jalaliSubYears,
    subDays: jalaliSubDays,
  },
};

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
    const today = new Date();
    const calendar = locale?.code === 'fa-IR' ? 'jalali' : 'gregorian';
    const utils = CalendarUtils[calendar];

    switch (key) {
      case 'today':
        return { key, startDate: utils.startOfToday(), endDate: utils.endOfToday() };
      case 'lastWeek':
        return { key, startDate: utils.subDays(today, 6), endDate: utils.endOfToday() };
      case 'lastMonth':
        return { key, startDate: utils.subDays(today, 30), endDate: utils.endOfToday() };
      case 'thisYear':
        return { key, startDate: utils.startOfYear(today), endDate: utils.endOfYear(today) };
      case 'lastYear':
        return {
          key,
          startDate: utils.startOfYear(utils.subYears(today, 1)),
          endDate: utils.endOfYear(utils.subYears(today, 1)),
        };
      default:
        return { startDate: null, endDate: null };
    }
  }

  /**
   * Compute a custom DateRange using explicit start and end dates, normalized
   * to the startOfDay and endOfDay respectively, considering the active calendar type.
   * @param startDate The user-selected start date
   * @param endDate The user-selected end date
   * @param locale The locale, used to determine whether to use Gregorian or Jalali calculations
   * @returns DateRange with type 'custom'
   */
  static fromCustom(startDate: Date, endDate: Date, locale?: Locale): DateRange {
    const calendar = locale?.code === 'fa-IR' ? 'jalali' : 'gregorian';
    const utils = CalendarUtils[calendar];

    return {
      key: 'custom',
      startDate: utils.startOfDay(startDate),
      endDate: utils.endOfDay(endDate),
    };
  }
}
