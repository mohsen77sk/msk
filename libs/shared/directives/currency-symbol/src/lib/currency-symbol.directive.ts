import { DEFAULT_CURRENCY_CODE, Directive, ElementRef, inject, LOCALE_ID, OnInit } from '@angular/core';
import { CURRENCY_BY_CODE, MskAvailableCurrencyCodes } from '@msk/shared/constants';

@Directive({
  standalone: true,
  selector: '[mskCurrencySymbol]',
  exportAs: 'mskCurrencySymbol',
})
export class MskCurrencySymbolDirective implements OnInit {
  private _elementRef = inject(ElementRef<HTMLElement>);
  private _localeId = inject(LOCALE_ID);
  private _currencyCode = inject(DEFAULT_CURRENCY_CODE) as MskAvailableCurrencyCodes;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    const config = CURRENCY_BY_CODE[this._currencyCode];

    let symbol = new Intl.NumberFormat(this._localeId, {
      style: 'currency',
      currency: config.intlCode,
    })
      .formatToParts()
      .find((part) => part.type === 'currency')?.value;

    // Replace IRT
    if (this._currencyCode === 'IRT') {
      symbol = symbol
        ?.replace(/\s*IRR\s*$/u, ` IRT`)
        ?.replace(/\s*ریال(?:\s*ایران)?\s*$/u, ` تومان`)
        ?.replace(/\s*﷼\s*$/u, ` تومان`);
    }

    this._elementRef.nativeElement.textContent = symbol;
  }
}
