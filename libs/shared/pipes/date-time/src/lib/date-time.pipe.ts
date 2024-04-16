import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

import { enUS } from 'date-fns/locale';
import { format as gregorianFormat } from 'date-fns';
import { faIR } from 'date-fns-jalali/locale';
import { format as jalaliFormat } from 'date-fns-jalali';

import { AvailableLangsIds } from '@msk/shared/utils/transloco';

const locale = {
  en: enUS,
  fa: faIR,
};
const localeFormat = {
  en: gregorianFormat,
  fa: jalaliFormat,
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
  /**
   * Constructor
   */
  constructor(@Inject(LOCALE_ID) private _locale: string) {}

  /**
   * Getter for locale
   */
  get locale(): AvailableLangsIds {
    return this._locale.valueOf() as AvailableLangsIds;
  }

  /**
   * Transform
   *
   * @param value A string to format
   * @param format A string to format from value
   * @returns
   */
  transform(value: Date | string | number | null | undefined, format = 'mediumDate'): string | null {
    if (value == null || value === '' || value !== value) return null;

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
    return localeFormat[this.locale](new Date(value), format, {
      locale: locale[this.locale],
    });
  }
}
