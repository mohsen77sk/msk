import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  ViewEncapsulation,
  effect,
  computed,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { DateRangeFactory } from '@msk/shared/utils/datetime';

import { Locale } from 'date-fns/locale';
import { DateRange, DateRangeItem, DateRangeKey } from './filter-date.types';

@Component({
  selector: 'msk-filter-date',
  templateUrl: './filter-date.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ScrollingModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    TranslocoModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MskFilterDateComponent,
      multi: true,
    },
    MskDateTimePipe,
  ],
})
export class MskFilterDateComponent implements ControlValueAccessor {
  private _matDateLocale = inject(MAT_DATE_LOCALE) as Locale;
  private _translocoService = inject(TranslocoService);
  private _mskDateTimePipe = inject(MskDateTimePipe);

  // Inputs
  label = input.required<string>();
  disabled = input<boolean>(false);

  value = signal<DateRange | null>(null);
  isDisabled = signal<boolean>(false);

  // Track custom date selection state
  customStartDate = signal<Date | null>(null);
  customEndDate = signal<Date | null>(null);

  // --- Datasource ---
  datasource: Partial<DateRangeItem>[] = [
    { id: 'today', name: 'filter-date.today' },
    { id: 'lastWeek', name: 'filter-date.last-week' },
    { id: 'lastMonth', name: 'filter-date.last-month' },
    { id: 'thisYear', name: 'filter-date.this-year' },
    { id: 'lastYear', name: 'filter-date.last-year' },
  ];

  idToNameKey: Record<DateRangeKey, string> = {
    today: 'filter-date.today',
    lastWeek: 'filter-date.last-week',
    lastMonth: 'filter-date.last-month',
    thisYear: 'filter-date.this-year',
    lastYear: 'filter-date.last-year',
    custom: 'filter-date.custom',
  };

  // Computed display label
  displayLabel = computed(() => {
    const currentValue = this.value();

    if (!currentValue?.key) {
      return this.label();
    }

    if (currentValue.key !== 'custom') {
      return this._translocoService.translate(this.idToNameKey[currentValue.key]);
    }

    // For custom range, show formatted dates
    if (currentValue.startDate && currentValue.endDate) {
      const startDateStr = this._mskDateTimePipe.transform(currentValue.startDate, 'relative');
      const endDateStr = this._mskDateTimePipe.transform(currentValue.endDate, 'relative');

      return startDateStr === endDateStr ? startDateStr : `${startDateStr} - ${endDateStr}`;
    }

    return this.idToNameKey.custom;
  });

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
    let nextValue: DateRange | null = null;

    if (filterKey && filterKey !== 'custom') {
      nextValue = DateRangeFactory.fromKey(filterKey, this._matDateLocale) as DateRange;
    }
    // custom filter
    else if (filterKey && filterKey === 'custom') {
      nextValue = DateRangeFactory.fromCustom(
        this.customStartDate() as Date,
        this.customEndDate() as Date,
        this._matDateLocale,
      ) as DateRange;
    }

    this.value.set(nextValue);
    this._onChange(nextValue);
    this._onTouched();
  }

  /**
   * open custom date picker
   * @param picker
   */
  openCustomDatePicker(picker: MatDateRangePicker<void>): void {
    // Set current dates before opening picker
    const currentValue = this.value();
    this.customStartDate.set(currentValue?.startDate ?? null);
    this.customEndDate.set(currentValue?.endDate ?? null);
    // Open
    picker.open();
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
      const next: DateRange = DateRangeFactory.fromKey(obj, this._matDateLocale) as DateRange;
      this.value.set(next);
      return;
    }

    if (obj?.key && !obj.startDate && !obj.endDate) {
      const next: DateRange = DateRangeFactory.fromKey(obj.key, this._matDateLocale) as DateRange;
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
