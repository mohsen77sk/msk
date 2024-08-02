import { Inject, Pipe, PipeTransform } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { Locale, enUS } from 'date-fns/locale';
import { format as gregorianFormat } from 'date-fns';
import { faIR } from 'date-fns-jalali/locale';
import { format as jalaliFormat } from 'date-fns-jalali';

const localeFormat = {
  gregorian: gregorianFormat,
  jalali: jalaliFormat,
};

/**
 * Formats a date value according to locale rules.
 */
@Pipe({
  standalone: true,
  name: 'mskDateTime',
  pure: false,
})
export class MskDateTimePipe implements PipeTransform {
  /** Calendar type. */
  private _calendarType: 'gregorian' | 'jalali' = 'gregorian';

  /**
   * Constructor
   */
  constructor(@Inject(MAT_DATE_LOCALE) private _dateLocale: string | Locale) {
    this.setLocale(_dateLocale);
  }

  /**
   * Sets the locale used for dates.
   *
   * @param locale The new locale
   */
  setLocale(locale: string | Locale): void {
    const _locale = typeof locale === 'string' ? locale : locale.code;

    if (_locale === 'en-US') {
      this._dateLocale = enUS;
      return;
    }

    if (_locale === 'fa-IR') {
      this._dateLocale = faIR;
      this._calendarType = 'jalali';
      return;
    }

    this._dateLocale = locale;
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
      locale: this._dateLocale as Locale,
    });
  }
}
