import { inject, Pipe, PipeTransform } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { Locale } from 'date-fns/locale';
import { differenceInDays, differenceInYears, format, startOfDay } from 'date-fns';
import {
  format as jalaliFormat,
  differenceInDays as jalaliDifferenceInDays,
  differenceInYears as jalaliDifferenceInYears,
  startOfDay as jalaliStartOfDay,
} from 'date-fns-jalali';

const CalendarUtils = {
  gregorian: {
    format,
    startOfDay,
    differenceInDays,
    differenceInYears,
  },
  jalali: {
    format: jalaliFormat,
    startOfDay: jalaliStartOfDay,
    differenceInDays: jalaliDifferenceInDays,
    differenceInYears: jalaliDifferenceInYears,
  },
};

/**
 * Formats a date value according to locale rules.
 */
@Pipe({
  standalone: true,
  name: 'mskDateTime',
})
export class MskDateTimePipe implements PipeTransform {
  matDateLocale = inject(MAT_DATE_LOCALE) as Locale;

  /** Calendar type. */
  private _calendarType: 'gregorian' | 'jalali' = 'gregorian';

  /**
   * Constructor
   */
  constructor() {
    if (this.matDateLocale.code === 'fa-IR') {
      this._calendarType = 'jalali';
    }
  }

  /**
   * Transform
   *
   * @param value A string to format
   * @param format A string to format from value
   * @returns
   */
  transform(value: Date | string | number | null | undefined, format = 'mediumDate'): string | null {
    if (value === '' || value == null || value !== value) return null;

    switch (format) {
      case 'relative':
        return this._formatRelative(value);
      case 'short':
        return this._formatDate(value, 'Pp');
      case 'medium':
        return this._formatDate(value, 'PPpp');
      case 'long':
        return this._formatDate(value, 'PPPppp');
      case 'full':
        return this._formatDate(value, 'PPPPpppp');
      case 'shortDate':
        return this._formatDate(value, 'P');
      case 'mediumDate':
        return this._formatDate(value, 'PP');
      case 'longDate':
        return this._formatDate(value, 'PPP');
      case 'fullDate':
        return this._formatDate(value, 'PPPP');
      case 'shortTime':
        return this._formatDate(value, 'p');
      case 'mediumTime':
        return this._formatDate(value, 'pp');
      case 'longTime':
        return this._formatDate(value, 'ppp');
      case 'fullTime':
        return this._formatDate(value, 'pppp');
      default:
        return this._formatDate(value, format);
    }
  }

  private _formatDate(value: Date | string | number, format: string): string {
    return CalendarUtils[this._calendarType].format(new Date(value), format, {
      locale: this.matDateLocale,
    });
  }

  private _formatRelative(date: Date | string | number) {
    const utils = CalendarUtils[this._calendarType];
    const dateWithoutTime = utils.startOfDay(date);
    const baseDateWithoutTime = utils.startOfDay(new Date());

    const diffInDays = Math.abs(utils.differenceInDays(dateWithoutTime, baseDateWithoutTime));
    const diffInYears = Math.abs(utils.differenceInYears(dateWithoutTime, baseDateWithoutTime));

    if (diffInDays <= 1) {
      return new Intl.RelativeTimeFormat(this.matDateLocale.code, { numeric: 'auto' }).format(diffInDays * -1, 'day');
    }
    if (diffInYears >= 1) {
      return this._formatDate(dateWithoutTime, 'P');
    }
    return this._formatDate(dateWithoutTime, 'MMMM d');
  }
}
