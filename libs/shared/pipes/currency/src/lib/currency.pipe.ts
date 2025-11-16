import { DEFAULT_CURRENCY_CODE, inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { CURRENCY_BY_CODE, MskAvailableCurrencyCodes } from '@msk/shared/constants';

/**
 * Currency formatting pipe with support for IRT (Toman).
 *
 * Features:
 * - Uses Intl.NumberFormat for locale-aware currency formatting
 * - Supports custom currency configuration (intlCode, fraction, multiplier)
 * - Automatically replaces unsupported currency symbols (e.g., Toman)
 *
 * Usage:
 *   {{ amount | mskCurrency }}
 *   {{ amount | mskCurrency : 'IRT' }}
 *
 * Example output:
 *   125000 | mskCurrency:'IRT'  →  "۱۲,۵۰۰ تومان"
 *   125000 | mskCurrency:'IRR'  →  "۱۲۵,۰۰۰ ریال"
 *
 * Notes:
 * - For IRT (Toman) values, `multiplier` is applied because Intl does not support 'IRT'
 * - For IRR (Rial), Intl symbol (﷼) is safely replaced with translated label
 */
@Pipe({
  standalone: true,
  name: 'mskCurrency',
})
export class MskCurrencyPipe implements PipeTransform {
  private _localeId = inject(LOCALE_ID);
  private _currencyCode = inject(DEFAULT_CURRENCY_CODE) as MskAvailableCurrencyCodes;

  /**
   * Transform
   *
   * @param value A string to format
   * @param format A string to format from value
   * @returns
   */
  transform(value: string | number | null | undefined, currencyCode?: MskAvailableCurrencyCodes): string | null {
    if (value === '' || value == null || value !== value) return null;

    const amount = typeof value === 'string' ? Number(value) : value;
    if (isNaN(amount)) return null;

    const code = currencyCode ?? this._currencyCode;
    const config = CURRENCY_BY_CODE[code];

    const normalized = config.multiplier ? amount / config.multiplier : amount;

    const intl = new Intl.NumberFormat(this._localeId, {
      style: 'currency',
      numberingSystem: 'latn',
      currency: config.intlCode,
      maximumFractionDigits: config.fraction,
    });

    let output = intl.format(normalized);

    if (this._localeId === 'fa-IR') {
      const parts = intl.formatToParts(normalized);

      const numberPart = parts
        .filter((p) => p.type === 'integer' || p.type === 'group' || p.type === 'decimal')
        .map((p) => p.value)
        .join('');
      const currencyPart = parts.find((p) => p.type === 'currency')?.value || '';

      output = `${numberPart} ${currencyPart}`;
    }

    // Replace IRT
    if (code === 'IRT') {
      output = output
        .replace(/\s*IRR\s*$/u, ` IRT`)
        .replace(/\s*ریال(?:\s*ایران)?\s*$/u, ` تومان`)
        .replace(/\s*﷼\s*$/u, ` تومان`);
    }

    return output.trim();
  }
}
