import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import {
  MskPageData,
  MskPagingRequest,
  MskLookupItem,
  MskPagingResponse,
  convertToMirzaPagingRequest,
  MskChangeEvent,
} from '@msk/shared/data-access';
import { DefaultPaymentTypeSortData, PaymentType } from './payment-type.types';

type PaymentTypesResponse = MskPagingResponse<PaymentType> | PaymentType[];

@Injectable({ providedIn: 'root' })
export class PaymentTypeService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  private _changes = new Subject<MskChangeEvent<PaymentType>>();

  /**
   * Stream of CRUD changes for in-place list updates
   */
  get changes$(): Observable<MskChangeEvent<PaymentType>> {
    return this._changes.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get payment types
   */
  getPaymentTypes(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultPaymentTypeSortData.active} ${DefaultPaymentTypeSortData.direction}`,
    },
  ): Observable<MskPageData<PaymentType>> {
    return this._httpClient
      .get<PaymentTypesResponse>(`${this._appConfig.apiEndpoint}/payment-types`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(map((response) => this._normalizePaymentTypesResponse(response, params)));
  }

  /**
   * Get lookup payment types
   */
  getLookupPaymentTypes(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultPaymentTypeSortData.active} ${DefaultPaymentTypeSortData.direction}`,
    },
  ): Observable<MskPageData<MskLookupItem>> {
    return this.getPaymentTypes(params).pipe(
      map((response) => {
        return new MskPageData({
          page: response.pageIndex + 1,
          pageSize: response.pageSize,
          total: response.total,
          items: response.items.map((item) => ({ id: item.code, code: item.code, name: item.title }) as MskLookupItem),
        });
      }),
    );
  }

  /**
   * Get payment type
   */
  getPaymentType(id: number | string): Observable<PaymentType> {
    return this._httpClient
      .get<PaymentType>(`${this._appConfig.apiEndpoint}/payment-types/${id}`)
      .pipe(map((response) => new PaymentType(response)));
  }

  /**
   * Create payment type
   */
  createPaymentType(paymentType: PaymentType): Observable<PaymentType> {
    return this._httpClient.post<PaymentType>(`${this._appConfig.apiEndpoint}/payment-types`, paymentType).pipe(
      map((response) => new PaymentType(response)),
      tap((paymentType) => this._changes.next({ type: 'create', item: paymentType })),
    );
  }

  /**
   * Update payment type
   */
  updatePaymentType(paymentType: PaymentType): Observable<PaymentType> {
    return this._httpClient
      .patch<PaymentType>(`${this._appConfig.apiEndpoint}/payment-types/${paymentType.id}`, paymentType)
      .pipe(
        map((response) => new PaymentType(response)),
        tap((paymentType) => this._changes.next({ type: 'update', item: paymentType })),
      );
  }

  /**
   * Delete payment type
   */
  deletePaymentType(paymentType: PaymentType): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this._appConfig.apiEndpoint}/payment-types/${paymentType.id}`).pipe(
      map((response) => response),
      tap(() => this._changes.next({ type: 'delete', id: paymentType.id })),
    );
  }

  private _normalizePaymentTypesResponse(
    response: PaymentTypesResponse,
    params: MskPagingRequest,
  ): MskPageData<PaymentType> {
    if (Array.isArray(response)) {
      const items = this._sortPaymentTypes(response.map((item) => new PaymentType(item)));

      return new MskPageData({
        page: params.page,
        pageSize: params.pageSize,
        total: items.length,
        items,
      });
    }

    return new MskPageData({
      ...response,
      items: this._sortPaymentTypes(response.items.map((item) => new PaymentType(item))),
    });
  }

  private _sortPaymentTypes(items: PaymentType[]): PaymentType[] {
    return items.sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.title.localeCompare(b.title));
  }
}
