import { Pipe, PipeTransform } from '@angular/core';

const LATIN_TO_PERSIAN_DIGITS: Record<string, string> = {
  '0': '۰',
  '1': '۱',
  '2': '۲',
  '3': '۳',
  '4': '۴',
  '5': '۵',
  '6': '۶',
  '7': '۷',
  '8': '۸',
  '9': '۹',
};

/**
 * Converts Latin digits (0-9) in a string to Persian digits (۰-۹).
 * Scoped to the printable sale invoice, which uses Persian digits by
 * design - this does not change the app-wide Latin-digit convention used
 * by mskCurrency/mskDateTime/mskMask elsewhere.
 */
@Pipe({
  standalone: true,
  name: 'mzPersianDigits',
})
export class PersianDigitsPipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (value == null) return '';

    return String(value).replace(/[0-9]/g, (digit) => LATIN_TO_PERSIAN_DIGITS[digit]);
  }
}
