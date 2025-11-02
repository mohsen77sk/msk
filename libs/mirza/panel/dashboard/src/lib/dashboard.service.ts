import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { SalesDailyReport, SalesPaymentTypeReport } from './dashboard.types';

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
}
