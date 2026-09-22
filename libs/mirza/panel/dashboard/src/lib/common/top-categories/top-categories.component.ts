import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateRange, DateRangeFactory, MskDateRangeKey } from '@msk/shared/utils/datetime';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { Locale } from 'date-fns';
import { filter, startWith, switchMap, tap } from 'rxjs';
import { DashboardService } from '../../dashboard.service';
import { TopCategoryReport } from '../../dashboard.types';

@Component({
  selector: 'mz-top-categories',
  templateUrl: './top-categories.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslocoDirective,
    NgApexchartsModule,
  ],
  providers: [DecimalPipe, MskCurrencyPipe],
})
export class DashboardTopCategoriesComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _decimalPipe = inject(DecimalPipe);
  private _mskCurrencyPipe = inject(MskCurrencyPipe);
  private _dashboardService = inject(DashboardService);
  private _translocoService = inject(TranslocoService);
  private _matDateLocale = inject(MAT_DATE_LOCALE) as Locale;

  dateRange = new FormControl<MskDateRange>(DateRangeFactory.fromKey('lastMonth', this._matDateLocale));

  idToNameKey: Record<string, string> = {
    lastMonth: 'filter-date.last-month',
    last3Month: 'filter-date.last-3month',
    last6Month: 'filter-date.last-6month',
  };

  isLoading = signal(false);
  chartOptions: ApexOptions = {};
  private _items: TopCategoryReport[] = [];

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.dateRange.valueChanges
      .pipe(
        startWith(this.dateRange.value),
        takeUntilDestroyed(this._destroyRef),
        filter((value) => !!value),
        switchMap((value) => {
          this.isLoading.set(true);
          return this._dashboardService.getTopCategories(
            value.startDate ?? new Date(),
            value.endDate ?? new Date(),
          );
        }),
        tap((res) => {
          this.generateChartData(res);
          this.isLoading.set(false);
        }),
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Change date range filter
   * @param key
   */
  changeDateRange(key: MskDateRangeKey): void {
    this.dateRange.setValue(DateRangeFactory.fromKey(key, this._matDateLocale));
  }

  /**
   * Prepare the chart data from the data
   */
  generateChartData(value: TopCategoryReport[]): void {
    this._items = value;
    this.chartOptions = {
      chart: {
        animations: {
          enabled: false,
        },
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'bar',
        toolbar: {
          show: false,
        },
        background: 'transparent',
      },
      colors: ['#64748B'],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: '60%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: false,
      },
      series: [
        {
          name: 'dashboard.quantity-sold',
          data: value.map((x) => x.totalQuantitySold),
        },
      ],
      xaxis: {
        categories: value.map((x) => x.categoryName),
        labels: {
          style: {
            colors: 'var(--mat-sys-secondary)',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: 'var(--mat-sys-secondary)',
          },
        },
      },
      tooltip: {
        theme: 'dark',
        custom: ({ dataPointIndex, w }): string => {
          const item = this._items[dataPointIndex];
          return `<div class="flex flex-col gap-1 px-3 py-2">
              <div class="text-md font-bold leading-none">${w.config.xaxis.categories[dataPointIndex]}</div>
              <div class="text-md leading-none">${this._translocoService.translate('dashboard.quantity-sold')}: ${this._decimalPipe.transform(item.totalQuantitySold)}</div>
              <div class="text-md leading-none">${this._translocoService.translate('dashboard.total-revenue')}: ${this._mskCurrencyPipe.transform(item.totalRevenue)}</div>
          </div>`;
        },
      },
    };
  }
}
