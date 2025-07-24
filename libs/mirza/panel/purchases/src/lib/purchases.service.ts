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
import { PurchaseInvoice, DefaultPurchasesSortId, DefaultPurchasesSortDirection } from './purchases.types';

@Injectable({ providedIn: 'root' })
export class PurchasesService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _invoices: BehaviorSubject<MskPageData<PurchaseInvoice>> = new BehaviorSubject<MskPageData<PurchaseInvoice>>(
    EmptyPageData
  );

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for purchase invoices
   */
  get purchaseInvoices$(): Observable<MskPageData<PurchaseInvoice>> {
    return this._invoices.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get purchase invoices
   *
   * @param params
   */
  getPurchaseInvoices(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultPurchasesSortId} ${DefaultPurchasesSortDirection}`,
    }
  ): Observable<MskPageData<PurchaseInvoice>> {
    return this._httpClient
      .get<MskPagingResponse<PurchaseInvoice>>(`${this._appConfig.apiEndpoint}/purchase`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new PurchaseInvoice(item)),
          });
        }),
        tap((response) => this._invoices.next(response))
      );
  }

  /**
   * Get purchase invoice
   *
   * @param id
   */
  getPurchaseInvoice(id: number | string): Observable<PurchaseInvoice> {
    return this._httpClient
      .get<PurchaseInvoice>(`${this._appConfig.apiEndpoint}/purchase/${id}`)
      .pipe(map((response) => new PurchaseInvoice(response)));
  }

  /**
   * Create purchase invoice
   *
   * @param invoice
   */
  createPurchaseInvoice(invoice: PurchaseInvoice): Observable<PurchaseInvoice> {
    return this._httpClient
      .post<PurchaseInvoice>(`${this._appConfig.apiEndpoint}/purchase`, invoice)
      .pipe(map((response) => new PurchaseInvoice(response)));
  }

  /**
   * Update purchase invoice
   *
   * @param invoice
   */
  updatePurchaseInvoice(invoice: PurchaseInvoice): Observable<PurchaseInvoice> {
    return this._httpClient
      .patch<PurchaseInvoice>(`${this._appConfig.apiEndpoint}/purchase/${invoice.id}`, invoice)
      .pipe(
        map((response) => new PurchaseInvoice(response)),
        // update the invoices
        tap((newInvoice) => {
          if (this._invoices.value) {
            const index = this._invoices.value.items.findIndex((x) => x.id === newInvoice.id) ?? 0;
            this._invoices.value.items[index] = newInvoice;
            this._invoices.next(this._invoices.value);
          }
        })
      );
  }

  /**
   * Delete purchase invoice
   *
   * @param invoice
   */
  deletePurchaseInvoice(invoice: PurchaseInvoice): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this._appConfig.apiEndpoint}/purchase/${invoice.id}`).pipe(
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
      })
    );
  }
}
