import { Directive, ElementRef, forwardRef, HostListener, inject, LOCALE_ID } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatCurrency } from '@angular/common';

@Directive({
  standalone: true,
  selector: 'input[mskCurrencyMask], textarea[mskCurrencyMask]',
  exportAs: 'mskCurrencyMask',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MskCurrencyMaskDirective), multi: true }],
})
export class MskCurrencyMaskDirective implements ControlValueAccessor {
  private _elementRef = inject(ElementRef);
  private _localeId = inject(LOCALE_ID);

  private onChange!: (value: unknown) => void;
  private onTouched!: () => void;

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    // Remove all non-numeric characters except for decimal point and minus sign
    const value = this._elementRef.nativeElement.value.replace(/[^\d.-]/g, '');

    if (this.onChange) {
      this.onChange(parseFloat(value));
    }
    this._formatInputValue();
  }

  @HostListener('blur', ['$event']) onBlur(event: unknown) {
    if (this.onTouched) {
      this.onTouched();
    }
    this._formatInputValue();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  writeValue(value: any): void {
    if (value) {
      const formattedValue = formatCurrency(value, this._localeId, '', '', '1.0-2');
      this._elementRef.nativeElement.value = formattedValue;
    } else {
      this._elementRef.nativeElement.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._elementRef.nativeElement.disabled = isDisabled;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _formatInputValue() {
    // Remove all non-numeric characters except for decimal point and minus sign
    const value = this._elementRef.nativeElement.value.replace(/[^\d.-]/g, '');

    if (value) {
      const numberValue = parseFloat(value);
      if (!isNaN(numberValue)) {
        const formattedValue = formatCurrency(numberValue, this._localeId, '', '', '1.0-2');
        this._elementRef.nativeElement.value = formattedValue;
      }
    }
  }
}
