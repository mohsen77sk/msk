import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import {
  SalesDailyReport,
  SalesPaymentTypeReport,
  TopCategoryReport,
  TopCustomerReport,
  TopProductReport,
} from './dashboard.types';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get sale reports
   *
   * @param params
   */
  getSalesDailyReports(dateFrom: Date, dateTo: Date): Observable<SalesDailyReport[]> {
    return this._httpClient
      .get<{ items: never[] }>(`${this._appConfig.apiEndpoint}/reports`, {
        params: { dateFrom: dateFrom.toISOString(), dateTo: dateTo.toISOString() },
      })
      .pipe(map((response) => response.items.map((item) => new SalesDailyReport(item))));
  }

  /**
   * Get sale payment types reports
   *
   * @param params
   */
  getSalePaymentTypesReports(dateFrom: Date, dateTo: Date): Observable<SalesPaymentTypeReport[]> {
    return this._httpClient
      .get<never[]>(`${this._appConfig.apiEndpoint}/reports/payment-type`, {
        params: { dateFrom: dateFrom.toISOString(), dateTo: dateTo.toISOString() },
      })
      .pipe(map((response) => response.map((item) => new SalesPaymentTypeReport(item))));
  }

  /**
   * Get top selling products
   *
   * @param params
   */
  getTopProducts(dateFrom: Date, dateTo: Date, limit = 10): Observable<TopProductReport[]> {
    return this._httpClient
      .get<never[]>(`${this._appConfig.apiEndpoint}/reports/top-products`, {
        params: { dateFrom: dateFrom.toISOString(), dateTo: dateTo.toISOString(), limit },
      })
      .pipe(map((response) => response.map((item) => new TopProductReport(item))));
  }

  /**
   * Get top selling categories
   *
   * @param params
   */
  getTopCategories(dateFrom: Date, dateTo: Date, limit = 10): Observable<TopCategoryReport[]> {
    return this._httpClient
      .get<never[]>(`${this._appConfig.apiEndpoint}/reports/top-categories`, {
        params: { dateFrom: dateFrom.toISOString(), dateTo: dateTo.toISOString(), limit },
      })
      .pipe(map((response) => response.map((item) => new TopCategoryReport(item))));
  }

  /**
   * Get top customers
   *
   * @param params
   */
  getTopCustomers(dateFrom: Date, dateTo: Date, limit = 10): Observable<TopCustomerReport[]> {
    return this._httpClient
      .get<never[]>(`${this._appConfig.apiEndpoint}/reports/top-customers`, {
        params: { dateFrom: dateFrom.toISOString(), dateTo: dateTo.toISOString(), limit },
      })
      .pipe(map((response) => response.map((item) => new TopCustomerReport(item))));
  }
}
