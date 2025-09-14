import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import {
  MskPagingResponse,
  MskPageData,
  EmptyPageData,
  MskPagingRequest,
  convertToMirzaPagingRequest,
} from '@msk/shared/data-access';
import { SaleInvoice, DefaultSalesSortData, ICreateSaleInvoice } from './sales.types';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _invoices: BehaviorSubject<MskPageData<SaleInvoice>> = new BehaviorSubject<MskPageData<SaleInvoice>>(
    EmptyPageData,
  );

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for sale invoices
   */
  get saleInvoices$(): Observable<MskPageData<SaleInvoice>> {
    return this._invoices.asObservable();
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
  ): Observable<MskPageData<SaleInvoice>> {
    return this._httpClient
      .get<MskPagingResponse<SaleInvoice>>(`${this._appConfig.apiEndpoint}/sale`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new SaleInvoice(item)),
          });
        }),
        tap((response) => this._invoices.next(response)),
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
    return this._httpClient
      .post<SaleInvoice>(`${this._appConfig.apiEndpoint}/sale`, invoice)
      .pipe(map((response) => new SaleInvoice(response)));
  }

  /**
   * Update sale invoice
   *
   * @param invoice
   */
  updateSaleInvoice(invoice: ICreateSaleInvoice): Observable<SaleInvoice> {
    return this._httpClient.patch<SaleInvoice>(`${this._appConfig.apiEndpoint}/sale/${invoice.id}`, invoice).pipe(
      map((response) => new SaleInvoice(response)),
      // update the invoices
      tap((newInvoice) => {
        if (this._invoices.value) {
          const index = this._invoices.value.items.findIndex((x) => x.id === newInvoice.id) ?? 0;
          this._invoices.value.items[index] = newInvoice;
          this._invoices.next(this._invoices.value);
        }
      }),
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
      // remove the invoices
      tap(() => {
        if (this._invoices.value) {
          const index = this._invoices.value.items.findIndex((x) => x.id === invoice.id);
          if (index > -1) {
            this._invoices.value.items.splice(index, 1);
            this._invoices.next(this._invoices.value);
          }
        }
      }),
    );
  }
}
