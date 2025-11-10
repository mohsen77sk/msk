import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import {
  MskPagingResponse,
  MskPageData,
  MskPagingRequest,
  convertToMirzaPagingRequest,
  MskChangeEvent,
} from '@msk/shared/data-access';
import { SaleInvoice, DefaultSalesSortData, ICreateSaleInvoice, ISaleInvoiceSummery } from './sales.types';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _changes = new Subject<MskChangeEvent<SaleInvoice>>();

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Stream of CRUD changes for in-place list updates
   */
  get changes$(): Observable<MskChangeEvent<SaleInvoice>> {
    return this._changes.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get sale invoices
   *
   * @param params
   */
  getSaleInvoices(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultSalesSortData.active} ${DefaultSalesSortData.direction}`,
    },
  ): Observable<MskPageData<SaleInvoice, ISaleInvoiceSummery>> {
    return this._httpClient
      .get<MskPagingResponse<SaleInvoice>>(`${this._appConfig.apiEndpoint}/sale`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new SaleInvoice(item)),
            data: response['summary'] as ISaleInvoiceSummery,
          });
        }),
      );
  }

  /**
   * Get sale invoice
   *
   * @param id
   */
  getSaleInvoice(id: number | string): Observable<SaleInvoice> {
    return this._httpClient
      .get<SaleInvoice>(`${this._appConfig.apiEndpoint}/sale/${id}`)
      .pipe(map((response) => new SaleInvoice(response)));
  }

  /**
   * Create sale invoice
   *
   * @param invoice
   */
  createSaleInvoice(invoice: ICreateSaleInvoice): Observable<SaleInvoice> {
    return this._httpClient.post<SaleInvoice>(`${this._appConfig.apiEndpoint}/sale`, invoice).pipe(
      map((response) => new SaleInvoice(response)),
      tap((invoice) => this._changes.next({ type: 'create', item: invoice })),
    );
  }

  /**
   * Update sale invoice
   *
   * @param invoice
   */
  updateSaleInvoice(invoice: ICreateSaleInvoice): Observable<SaleInvoice> {
    return this._httpClient.patch<SaleInvoice>(`${this._appConfig.apiEndpoint}/sale/${invoice.id}`, invoice).pipe(
      map((response) => new SaleInvoice(response)),
      tap((invoice) => this._changes.next({ type: 'update', item: invoice })),
    );
  }

  /**
   * Delete sale invoice
   *
   * @param invoice
   */
  deleteSaleInvoice(invoice: SaleInvoice): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this._appConfig.apiEndpoint}/sale/${invoice.id}`).pipe(
      map((response) => response),
      tap(() => this._changes.next({ type: 'delete', id: invoice.id })),
    );
  }
}
