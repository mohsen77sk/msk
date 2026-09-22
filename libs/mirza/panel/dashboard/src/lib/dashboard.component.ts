import { Component, ViewEncapsulation } from '@angular/core';
import { DashboardOrdersSummaryComponent } from './common/orders-summary/orders-summary.component';
import { DashboardPaymentSummaryComponent } from './common/payment-summary/payment-summary.component';
import { DashboardSalesRevenueSummaryComponent } from './common/sales-revenue-summary/sales-revenue-summary.component';
import { DashboardTopProductsComponent } from './common/top-products/top-products.component';
import { DashboardTopCategoriesComponent } from './common/top-categories/top-categories.component';
import { DashboardTopCustomersComponent } from './common/top-customers/top-customers.component';

@Component({
  selector: 'mz-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    DashboardOrdersSummaryComponent,
    DashboardPaymentSummaryComponent,
    DashboardSalesRevenueSummaryComponent,
    DashboardTopProductsComponent,
    DashboardTopCategoriesComponent,
    DashboardTopCustomersComponent,
  ],
})
export class DashboardComponent {}
