import { Directive, ElementRef, inject, LOCALE_ID, OnInit } from '@angular/core';
import { getLocaleCurrencySymbol } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[mskCurrencySymbol]',
  exportAs: 'mskCurrencySymbol',
})
export class MskCurrencySymbolDirective implements OnInit {
  private _elementRef = inject(ElementRef);
  private _localeId = inject(LOCALE_ID);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    (this._elementRef.nativeElement as Element).innerHTML = getLocaleCurrencySymbol(this._localeId) ?? '';
  }
}
