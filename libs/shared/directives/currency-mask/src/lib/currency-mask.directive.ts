import {
  DEFAULT_CURRENCY_CODE,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  LOCALE_ID,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  standalone: true,
  selector: 'input[mskCurrencyMask], textarea[mskCurrencyMask]',
  exportAs: 'mskCurrencyMask',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MskCurrencyMaskDirective), multi: true }],
})
export class MskCurrencyMaskDirective implements ControlValueAccessor {
  private _elementRef = inject(ElementRef);
  private _localeId = inject(LOCALE_ID);
  private _currencyCode = inject(DEFAULT_CURRENCY_CODE);

  private onChange!: (value: number | null) => void;
  private onTouched!: () => void;

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const numeric = this._parse(value);
    this.onChange(numeric);
    this._elementRef.nativeElement.value = this._format(numeric);
    this._setCaretPosition();
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
    // ensure full formatting on blur
    const val = this._parse(this._elementRef.nativeElement.value);
    this._elementRef.nativeElement.value = this._format(val);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  writeValue(value: number | null): void {
    const formatted = this._format(value);
    this._elementRef.nativeElement.value = formatted;
  }

  registerOnChange(fn: typeof this.onChange): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: typeof this.onTouched): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._elementRef.nativeElement.disabled = isDisabled;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _format(value: number | null): string {
    if (value === null || isNaN(value)) return '';
    const currencyOpts = new Intl.NumberFormat(this._localeId, {
      style: 'currency',
      currency: this._currencyCode,
    }).resolvedOptions();

    return new Intl.NumberFormat(this._localeId, {
      style: 'decimal',
      numberingSystem: 'latn',
      minimumFractionDigits: currencyOpts.minimumFractionDigits,
      maximumFractionDigits: currencyOpts.maximumFractionDigits,
    }).format(value);
  }

  private _parse(value: string): number | null {
    if (!value) return null;
    // Remove everything except digits and decimal separators
    const example = new Intl.NumberFormat(this._localeId);
    const parts = example.format(12345.6).match(/[\D]/g) || [];
    // Identify decimal separator (last non-digit char)
    const decSep = parts[parts.length - 1];
    const normalized = value.replace(new RegExp(`[^0-9${decSep}]`, 'g'), '').replace(decSep, '.');
    const num = parseFloat(normalized);
    return isNaN(num) ? null : num;
  }

  private _setCaretPosition() {
    // reset caret to end (simplest approach)
    const len = this._elementRef.nativeElement.value.length;
    this._elementRef.nativeElement.setSelectionRange(len, len);
  }
}
