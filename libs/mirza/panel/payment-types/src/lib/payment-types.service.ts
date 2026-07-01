import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { MskHttpCacheService } from '@msk/shared/services/http-cache';
import {
  MskPageData,
  MskPagingRequest,
  MskLookupItem,
  MskPagingResponse,
  convertToMirzaPagingRequest,
  MskChangeEvent,
} from '@msk/shared/data-access';
import { DefaultPaymentTypeSortData, PaymentType } from './payment-types.types';

@Injectable({ providedIn: 'root' })
export class PaymentTypesService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);
  private _httpCache = inject(MskHttpCacheService);

  // Private
  private _cacheKey = '/payment-types';
  private _changes = new Subject<MskChangeEvent<PaymentType>>();

  /**
   * Constructor
   */
  constructor() {
    this.changes$
      .pipe(
        tap(() => {
          this._httpCache.invalidatePrefix(this._cacheKey);
        }),
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

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
    const cacheKey = this._httpCache.buildCacheKey(this._cacheKey, params);
    return this._httpCache.get(cacheKey, () =>
      this._httpClient
        .get<MskPagingResponse<PaymentType>>(`${this._appConfig.apiEndpoint}/payment-types`, {
          params: convertToMirzaPagingRequest(params),
        })
        .pipe(
          map((response) => {
            return new MskPageData({
              ...response,
              items: response.items.map((item) => new PaymentType(item)),
            });
          }),
        ),
    );
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
        return {
          ...response,
          items: response.items
            .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
            .map((item) => ({ id: item.id, name: item.name }) as MskLookupItem),
        };
      }),
    );
  }

  /**
   * Get payment type
   *
   * @param id
   */
  getPaymentType(id: number | string): Observable<PaymentType> {
    return this._httpClient
      .get<PaymentType>(`${this._appConfig.apiEndpoint}/payment-types/${id}`)
      .pipe(map((response) => new PaymentType(response)));
  }

  /**
   * Create payment type
   *
   * @param paymentType
   */
  createPaymentType(paymentType: PaymentType): Observable<PaymentType> {
    return this._httpClient.post<PaymentType>(`${this._appConfig.apiEndpoint}/payment-types`, paymentType).pipe(
      map((response) => new PaymentType(response)),
      tap((paymentType) => this._changes.next({ type: 'create', item: paymentType })),
    );
  }

  /**
   * Update payment type
   *
   * @param paymentType
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
   *
   * @param paymentType
   */
  deletePaymentType(paymentType: PaymentType): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this._appConfig.apiEndpoint}/payment-types/${paymentType.id}`).pipe(
      map((response) => response),
      tap(() => this._changes.next({ type: 'delete', id: paymentType.id })),
    );
  }
}
