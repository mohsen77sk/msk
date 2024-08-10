import { Injectable } from '@angular/core';
import { Banks } from './iranian-banks.constants';

@Injectable({ providedIn: 'root' })
export class MskIranianBanksService {
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Find Bank's name by card number
   *
   * @param digits - Card number
   * @return string | null | undefined
   */
  getBankNameFromCardNumber(digits?: number | string): string | null | undefined {
    const digitsLength = (digits?.toString() ?? '').length;

    if (!digits || !(digitsLength >= 6 && digitsLength <= 16)) {
      return;
    }

    const code = digits.toString().substr(0, 6);
    const findBank = Banks.find((bank) => bank.cardCodes.includes(code));

    if (findBank) {
      return findBank.persianName;
    } else {
      return null;
    }
  }
}
