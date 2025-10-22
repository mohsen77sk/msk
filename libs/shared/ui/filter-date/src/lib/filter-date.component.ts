import { ChangeDetectionStrategy, Component, inject, input, signal, ViewEncapsulation, effect } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslocoModule } from '@jsverse/transloco';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { Locale } from 'date-fns/locale';
import { DateRange, DateRangeItem, DateRangeKey } from './filter-date.types';
import { DateRangeFactory } from './date-range.factory';

@Component({
  selector: 'msk-filter-date',
  templateUrl: './filter-date.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule, MatIconModule, MatMenuModule, MatButtonModule, TranslocoModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MskFilterDateComponent,
      multi: true,
    },
  ],
})
export class MskFilterDateComponent implements ControlValueAccessor {
  private _matDateLocale = inject(MAT_DATE_LOCALE) as Locale;

  // Inputs
  label = input.required<string>();
  disabled = input<boolean>(false);

  value = signal<DateRange | null>(null);
  isDisabled = signal<boolean>(false);

  // --- Datasource ---
  datasource: Partial<DateRangeItem>[] = [
    { id: 'today', name: 'filter-date.today' },
    { id: 'lastWeek', name: 'filter-date.last-week' },
    { id: 'lastMonth', name: 'filter-date.last-month' },
    { id: 'thisYear', name: 'filter-date.this-year' },
    { id: 'lastYear', name: 'filter-date.last-year' },
    { id: 'custom', name: 'filter-date.custom' },
  ];

  idToNameKey: Record<DateRangeKey, string> = {
    today: 'filter-date.today',
    lastWeek: 'filter-date.last-week',
    lastMonth: 'filter-date.last-month',
    thisYear: 'filter-date.this-year',
    lastYear: 'filter-date.last-year',
    custom: 'filter-date.last-year',
  };

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      this.isDisabled.set(this.disabled());
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * update value and
   */
  updateValue(filterKey?: DateRangeKey): void {
    const nextValue: DateRange | null = filterKey ? DateRangeFactory.fromKey(filterKey, this._matDateLocale) : null;

    this.value.set(nextValue);
    this._onChange(nextValue);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ ControlValueAccessor
  // -----------------------------------------------------------------------------------------------------

  private _onChange: (value: DateRange | null) => void = () => {
    return;
  };
  private _onTouched: () => void = () => {
    return;
  };

  writeValue(obj: DateRange | DateRangeKey | null): void {
    if (typeof obj === 'string') {
      const next: DateRange = DateRangeFactory.fromKey(obj, this._matDateLocale);
      this.value.set(next);
      return;
    }

    if (obj?.key && !obj.startDate && !obj.endDate) {
      const next: DateRange = DateRangeFactory.fromKey(obj.key, this._matDateLocale);
      this.value.set(next);
      return;
    }
    this.value.set(obj);
  }

  registerOnChange(fn: typeof this._onChange): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: typeof this._onTouched): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
