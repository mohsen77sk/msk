import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { DateRange, DateRangeFactory } from '@msk/shared/ui/filter-date';
import { Locale } from 'date-fns';

@Component({
  selector: 'mz-payment-summary',
  templateUrl: './payment-summary.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, TranslocoDirective],
})
export class DashboardPaymentSummaryComponent {
  private _matDateLocale = inject(MAT_DATE_LOCALE) as Locale;

  dateRange = new FormControl<DateRange>(DateRangeFactory.fromKey('today', this._matDateLocale));
}
