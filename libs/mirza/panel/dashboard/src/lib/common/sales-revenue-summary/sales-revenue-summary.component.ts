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
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { MskDateRange, DateRangeFactory, MskDateRangeKey } from '@msk/shared/utils/datetime';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { filter, startWith, switchMap, tap } from 'rxjs';
import { Locale } from 'date-fns';
import { DashboardService } from '../../dashboard.service';
import { SalesDailyReport } from '../../dashboard.types';

@Component({
  selector: 'mz-sales-revenue-summary',
  templateUrl: './sales-revenue-summary.component.html',
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
    MskCurrencyPipe,
  ],
  providers: [MskDateTimePipe, MskCurrencyPipe],
})
export class DashboardSalesRevenueSummaryComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _mskDateTimePipe = inject(MskDateTimePipe);
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
  averageRevenue = signal(0);
  maxRevenue = signal(0);
  minRevenue = signal(0);

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
          return this._dashboardService.getSalesDailyReports(
            value.startDate ?? new Date(),
            value.endDate ?? new Date(),
          );
        }),
        tap((res) => {
          this.generateChartData(res);
          const revenueNumbers = res.map((item) => item.totalSales);
          if (revenueNumbers.length > 0) {
            this.averageRevenue.set(
              revenueNumbers.reduce((sum, current) => sum + current, 0) / revenueNumbers.length,
            );
            this.maxRevenue.set(Math.max(...revenueNumbers));
            this.minRevenue.set(Math.min(...revenueNumbers));
          } else {
            this.averageRevenue.set(0);
            this.maxRevenue.set(0);
            this.minRevenue.set(0);
          }
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
  generateChartData(value: SalesDailyReport[]): void {
    this.chartOptions = {
      chart: {
        animations: {
          enabled: false,
        },
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'area',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        background: 'transparent',
      },
      colors: ['#64748B', '#94A3B8'],
      fill: {
        colors: ['#64748B', '#94A3B8'],
        opacity: 0.5,
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: false,
        padding: {
          bottom: -40,
          left: 0,
          right: 0,
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      series: [
        {
          name: 'dashboard.total-sales',
          data: value.map((x) => x.totalSales),
        },
      ],
      xaxis: {
        type: 'datetime',
        categories: value.map((x) => x.date.toISOString()),
        labels: {
          offsetY: -20,
          style: {
            colors: 'var(--mat-sys-secondary)',
          },
          formatter: (val) => this._mskDateTimePipe.transform(val, 'relative') ?? '',
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        min: 0,
        labels: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
        show: false,
      },
      tooltip: {
        theme: 'dark',
        y: {
          title: { formatter: (val) => this._translocoService.translate(val) + ': ' },
          formatter: (val) => this._mskCurrencyPipe.transform(val) ?? '',
        },
        x: { formatter: (val) => this._mskDateTimePipe.transform(val, 'fullDate') ?? '' },
      },
    };
  }
}
