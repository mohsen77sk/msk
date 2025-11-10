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
import {
  PurchaseInvoice,
  DefaultPurchasesSortData,
  ICreatePurchaseInvoice,
  IPurchaseInvoiceSummery,
} from './purchases.types';

@Injectable({ providedIn: 'root' })
export class PurchasesService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _changes = new Subject<MskChangeEvent<PurchaseInvoice>>();

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Stream of CRUD changes for in-place list updates
   */
  get changes$(): Observable<MskChangeEvent<PurchaseInvoice>> {
    return this._changes.asObservable();
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
      sortBy: `${DefaultPurchasesSortData.active} ${DefaultPurchasesSortData.direction}`,
    },
  ): Observable<MskPageData<PurchaseInvoice, IPurchaseInvoiceSummery>> {
    return this._httpClient
      .get<MskPagingResponse<PurchaseInvoice>>(`${this._appConfig.apiEndpoint}/purchase`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new PurchaseInvoice(item)),
            data: response['summary'] as IPurchaseInvoiceSummery,
          });
        }),
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
  createPurchaseInvoice(invoice: ICreatePurchaseInvoice): Observable<PurchaseInvoice> {
    return this._httpClient.post<PurchaseInvoice>(`${this._appConfig.apiEndpoint}/purchase`, invoice).pipe(
      map((response) => new PurchaseInvoice(response)),
      tap((invoice) => this._changes.next({ type: 'create', item: invoice })),
    );
  }

  /**
   * Update purchase invoice
   *
   * @param invoice
   */
  updatePurchaseInvoice(invoice: ICreatePurchaseInvoice): Observable<PurchaseInvoice> {
    return this._httpClient
      .patch<PurchaseInvoice>(`${this._appConfig.apiEndpoint}/purchase/${invoice.id}`, invoice)
      .pipe(
        map((response) => new PurchaseInvoice(response)),
        tap((invoice) => this._changes.next({ type: 'update', item: invoice })),
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
      tap(() => this._changes.next({ type: 'delete', id: invoice.id })),
    );
  }
}
