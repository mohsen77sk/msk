import { inject, Pipe, PipeTransform } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { Locale } from 'date-fns/locale';
import { faIR } from 'date-fns-jalali/locale';
import { differenceInDays, differenceInYears, format, formatRelative, startOfDay } from 'date-fns';
import {
  format as jalaliFormat,
  formatRelative as jalaliFormatRelative,
  differenceInDays as jalaliDifferenceInDays,
  differenceInYears as jalaliDifferenceInYears,
  startOfDay as jalaliStartOfDay,
} from 'date-fns-jalali';

const localeFormat = {
  gregorian: format,
  jalali: jalaliFormat,
};

const relativeFormat = {
  gregorian: formatRelative,
  jalali: jalaliFormatRelative,
};

const localeStartOfDay = {
  gregorian: startOfDay,
  jalali: jalaliStartOfDay,
};

const localeDiffInDays = {
  gregorian: differenceInDays,
  jalali: jalaliDifferenceInDays,
};

const localeDiffInYears = {
  gregorian: differenceInYears,
  jalali: jalaliDifferenceInYears,
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
      this.matDateLocale = faIR;
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
    return localeFormat[this._calendarType](new Date(value), format, {
      locale: this.matDateLocale,
    });
  }

  private _formatRelative(date: Date | string | number) {
    const dateWithoutTime = localeStartOfDay[this._calendarType](date);
    const baseDateWithoutTime = localeStartOfDay[this._calendarType](new Date());

    const diffInDays = Math.abs(localeDiffInDays[this._calendarType](dateWithoutTime, baseDateWithoutTime));
    const diffInYears = Math.abs(localeDiffInYears[this._calendarType](dateWithoutTime, baseDateWithoutTime));

    if (diffInDays <= 1) {
      return relativeFormat[this._calendarType](dateWithoutTime, baseDateWithoutTime, { locale: this.matDateLocale });
    }
    if (diffInYears >= 1) {
      return this._formatDate(dateWithoutTime, 'P');
    }
    return this._formatDate(dateWithoutTime, 'MMMM d');
  }
}
