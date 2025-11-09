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
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { MskUtilsService } from '@msk/shared/services/utils';
import { MskDateRange, DateRangeFactory } from '@msk/shared/utils/datetime';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { filter, startWith, switchMap, tap } from 'rxjs';
import { Locale } from 'date-fns';
import { DashboardService } from '../../dashboard.service';
import { SalesDailyReport } from '../../dashboard.types';

@Component({
  selector: 'mz-orders-summary',
  templateUrl: './orders-summary.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslocoDirective,
    NgApexchartsModule,
  ],
  providers: [DecimalPipe, MskDateTimePipe],
})
export class DashboardOrdersSummaryComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _decimalPipe = inject(DecimalPipe);
  private _mskUtilsService = inject(MskUtilsService);
  private _mskDateTimePipe = inject(MskDateTimePipe);
  private _dashboardService = inject(DashboardService);
  private _translocoService = inject(TranslocoService);
  private _matDateLocale = inject(MAT_DATE_LOCALE) as Locale;

  dateRange = new FormControl<MskDateRange>(DateRangeFactory.fromKey('lastMonth', this._matDateLocale));

  isLoading = signal(false);
  chartOptions: ApexOptions = {};
  averageCount = signal(0);
  maxCount = signal(0);
  minCount = signal(0);

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
          const salesNumbers = res.map((item) => item.numberOfSales);
          this.averageCount.set(salesNumbers.reduce((sum, current) => sum + current, 0) / salesNumbers.length);
          this.maxCount.set(Math.max(...salesNumbers));
          this.minCount.set(Math.min(...salesNumbers));
          this.isLoading.set(false);
        }),
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

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
          data: value.map((x) => x.numberOfSales),
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
          style: {
            colors: 'var(--mat-sys-secondary)',
          },
          formatter: (value) => this._mskUtilsService.abbrNumber(value),
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
          formatter: (val) => this._decimalPipe.transform(val) ?? '',
        },
        x: { formatter: (val) => this._mskDateTimePipe.transform(val, 'fullDate') ?? '' },
      },
    };
  }
}
