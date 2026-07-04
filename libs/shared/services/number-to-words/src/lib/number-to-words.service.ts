import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { PersianNumberToWords, EnglishNumberToWords } from '@msk/shared/utils/number';

@Injectable({ providedIn: 'root' })
export class MskNumberToWordsService {
  private _localeId = inject(LOCALE_ID);

  /**
   * Convert number to words based on the current locale
   * @param num The number to convert
   */
  convert(num: number): string {
    const activeLang = this._localeId;
    return this.convertToLang(num, activeLang);
  }

  /**
   * Convert number to words based on the specified language
   * @param num The number to convert
   * @param lang The language code (e.g., 'en', 'fa')
   */
  convertToLang(num: number, lang: string): string {
    const formattedLang = lang.toLowerCase();

    if (formattedLang === 'fa' || formattedLang.startsWith('fa')) {
      return PersianNumberToWords.convert(num);
    } else {
      // Default to English
      return EnglishNumberToWords.convert(num);
    }
  }
}
