import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslocoService } from '@jsverse/transloco';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { Locale } from 'date-fns/locale';
import { faIR } from 'date-fns-jalali/locale';
import { startOfToday, endOfToday, startOfYear, endOfYear, subYears, subDays } from 'date-fns';
import {
  startOfToday as jalaliStartOfToday,
  endOfToday as jalaliEndOfToday,
  startOfYear as jalaliStartOfYear,
  endOfYear as jalaliEndOfYear,
  subYears as jalaliSubYears,
  subDays as jalaliSubDays,
} from 'date-fns-jalali';
import { DateChangeOutput, FilterItem, FilterKey } from './filter-date.types';

// -----------------------------------------------------------------------------------------------------
// @ Helper Maps
// -----------------------------------------------------------------------------------------------------

const dateFnsByCalendar = {
  gregorian: {
    startOfToday,
    endOfToday,
    startOfYear,
    endOfYear,
    subYears,
    subDays,
  },
  jalali: {
    startOfToday: jalaliStartOfToday,
    endOfToday: jalaliEndOfToday,
    startOfYear: jalaliStartOfYear,
    endOfYear: jalaliEndOfYear,
    subYears: jalaliSubYears,
    subDays: jalaliSubDays,
  },
};

@Component({
  selector: 'msk-filter-date',
  templateUrl: './filter-date.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule, MatIconModule, MatMenuModule, MatButtonModule],
})
export class MskFilterDateComponent implements OnInit {
  private _translocoService = inject(TranslocoService);
  private _matDateLocale = inject(MAT_DATE_LOCALE) as Locale;

  // Inputs
  label = input.required<string>();
  disabled = input<boolean>(false);
  defaultFilter = input<FilterKey>('today');
  dateChange = output<DateChangeOutput>();

  value = signal<Partial<FilterItem> | undefined>(undefined);

  // --- Datasource ---
  datasource: Partial<FilterItem>[] = [
    { id: 'today', name: this._translocoService.translate('filter-date.today') },
    { id: 'lastWeek', name: this._translocoService.translate('filter-date.last-week') },
    { id: 'lastMonth', name: this._translocoService.translate('filter-date.last-month') },
    { id: 'thisYear', name: this._translocoService.translate('filter-date.this-year') },
    { id: 'lastYear', name: this._translocoService.translate('filter-date.last-year') },
    // { id: 'custom', name: this._translocoService.translate('filter-date.custom') },
  ];

  // --- Local state ---
  private _calendarType: 'gregorian' | 'jalali' = 'gregorian';

  /**
   * Constructor
   */
  constructor() {
    if (this._matDateLocale.code === 'fa-IR') {
      this._calendarType = 'jalali';
      this._matDateLocale = faIR;
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    const defaultKey = this.defaultFilter();
    const defaultItem = this.datasource.find((d) => d.id === defaultKey);

    if (defaultItem) {
      this.value.set(defaultItem);
      this.updateValue(defaultKey);
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * update value and
   */
  updateValue(filterKey?: FilterKey): void {
    const today = new Date();
    const fns = dateFnsByCalendar[this._calendarType];

    let startDate: Date | null = today;
    let endDate: Date | null = today;

    switch (filterKey) {
      case 'today':
        startDate = fns.startOfToday();
        endDate = fns.endOfToday();
        break;

      case 'lastWeek':
        startDate = fns.subDays(today, 6);
        endDate = fns.endOfToday();
        break;

      case 'lastMonth':
        startDate = fns.subDays(today, 30);
        endDate = fns.endOfToday();
        break;

      case 'thisYear':
        startDate = fns.startOfYear(today);
        endDate = fns.endOfYear(today);
        break;

      case 'lastYear':
        startDate = fns.startOfYear(fns.subYears(today, 1));
        endDate = fns.endOfYear(fns.subYears(today, 1));
        break;

      default:
        startDate = null;
        endDate = null;
    }

    this.dateChange.emit({ startDate, endDate });
    this.value.set(this.datasource.find((d) => d.id === filterKey));
  }
}
