import { DEFAULT_CURRENCY_CODE, Directive, ElementRef, inject, LOCALE_ID, OnInit } from '@angular/core';
import { CURRENCY_BY_CODE, MskAvailableCurrencyCodes } from '@msk/shared/constants';

@Directive({
  standalone: true,
  selector: '[mskCurrencySymbol]',
  exportAs: 'mskCurrencySymbol',
})
export class MskCurrencySymbolDirective implements OnInit {
  private _elementRef = inject(ElementRef);
  private _localeId = inject(LOCALE_ID);
  private _currencyCode = inject(DEFAULT_CURRENCY_CODE);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // If don't have translate
    const currencySymbol =
      Intl.NumberFormat(this._localeId, {
        style: 'currency',
        currency: CURRENCY_BY_CODE[this._currencyCode as MskAvailableCurrencyCodes].intlCode,
      })
        .formatToParts()
        .find((part) => part.type === 'currency')?.value || this._currencyCode;

    (this._elementRef.nativeElement as Element).innerHTML = currencySymbol;
  }
}
