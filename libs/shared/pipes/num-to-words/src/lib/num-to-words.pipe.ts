import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { MskNumberToWordsService } from '@msk/shared/services/number-to-words';
import { MskAvailableLangsIds } from '@msk/shared/constants';

@Pipe({
  standalone: true,
  name: 'mskNumToWords',
})
export class MskNumToWordsPipe implements PipeTransform {
  private _localeId = inject(LOCALE_ID);
  private _numToWordsService = inject(MskNumberToWordsService);

  /**
   * Transform
   *
   * @param value A string to format
   * @param langCode A string to language code from value
   * @returns
   */
  transform(value: string | number | null | undefined, langCode?: MskAvailableLangsIds): string | null {
    if (value === '' || value == null || value !== value) return null;

    const code = langCode ?? this._localeId;
    let number: number;

    if (typeof value === 'string') {
      // convert persian and arabic numbers to english numbers
      let cleanValue = value
        .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
        .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632));

      // remove all non-numeric characters except for the decimal point and negative sign
      cleanValue = cleanValue.replace(/[^\d.-]/g, '');

      // convert the cleaned string to a number
      number = Number(cleanValue);
    } else {
      number = value;
    }
    if (isNaN(number) || number === null) return null;

    return this._numToWordsService.convertToLang(number, code);
  }
}
