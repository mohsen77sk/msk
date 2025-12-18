import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
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
import { DashboardService } from '../../dashboard.service';
import { filter, startWith, switchMap, tap } from 'rxjs';
import { SalesPaymentTypeReport } from '../../dashboard.types';

@Component({
  selector: 'mz-payment-summary',
  templateUrl: './payment-summary.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MskCurrencyPipe,
    TranslocoDirective,
    NgApexchartsModule,
  ],
  providers: [DecimalPipe],
})
export class DashboardPaymentSummaryComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _decimalPipe = inject(DecimalPipe);
  private _dashboardService = inject(DashboardService);
  private _translocoService = inject(TranslocoService);
  private _matDateLocale = inject(MAT_DATE_LOCALE) as Locale;

  dateRange = new FormControl<MskDateRange>(DateRangeFactory.fromKey('today', this._matDateLocale));

  idToNameKey: Record<string, string> = {
    today: 'filter-date.today',
    yesterday: 'filter-date.yesterday',
    lastWeek: 'filter-date.last-week',
    lastMonth: 'filter-date.last-month',
  };

  isLoading = signal(false);
  chartOptions: ApexOptions = {};

  /**
   * Payment types value
   */
  get paymentTypesValue(): number[] {
    return this.chartOptions.series as number[];
  }

  /**
   * Sum of payment types value
   */
  get paymentTypesValueSum(): number {
    return (this.chartOptions.series as number[])?.reduce((sum, item) => sum + item, 0) ?? 0;
  }

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
          return this._dashboardService.getSalePaymentTypesReports(
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
  generateChartData(value: SalesPaymentTypeReport[]): void {
    this.chartOptions = {
      chart: {
        animations: {
          speed: 400,
          animateGradually: {
            enabled: false,
          },
        },
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'pie',
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#3182ce', '#319795', '#dd6b20', '#805ad5'],
      labels: value.map((v) => this._translocoService.translate('paymentTypes.' + v.paymentType)),
      plotOptions: {
        pie: {
          customScale: 0.9,
          expandOnClick: false,
          donut: {
            size: '70%',
          },
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['var(--mat-sys-surface)'],
      },
      series: value.map((v) => v.totalAmount),
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
        active: {
          filter: {
            type: 'none',
          },
        },
      },
      tooltip: {
        enabled: true,
        fillSeriesColor: false,
        theme: 'dark',
        custom: ({ seriesIndex, w }): string =>
          `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
              <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
              <div class="ms-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
              <div class="ms-2 text-md font-bold leading-none">${this._decimalPipe.transform(w.config.series[seriesIndex])}</div>
          </div>`,
      },
    };
  }
}
