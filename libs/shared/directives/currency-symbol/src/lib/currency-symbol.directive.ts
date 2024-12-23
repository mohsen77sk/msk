import { DEFAULT_CURRENCY_CODE, Directive, ElementRef, inject, LOCALE_ID, OnInit } from '@angular/core';

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
    const currencySymbol =
      Intl.NumberFormat(this._localeId, { style: 'currency', currency: this._currencyCode })
        .formatToParts()
        .find((part) => part.type === 'currency')?.value || this._currencyCode;

    (this._elementRef.nativeElement as Element).innerHTML = currencySymbol;
  }
}
