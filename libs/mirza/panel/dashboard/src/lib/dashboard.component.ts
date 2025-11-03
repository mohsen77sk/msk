import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { mskAnimations } from '@msk/shared/animations';
import { DashboardOrdersSummaryComponent } from './common/orders-summary/orders-summary.component';
import { DashboardPaymentSummaryComponent } from './common/payment-summary/payment-summary.component';

@Component({
  selector: 'mz-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: mskAnimations,
  imports: [DashboardOrdersSummaryComponent, DashboardPaymentSummaryComponent],
})
export class DashboardComponent {}
