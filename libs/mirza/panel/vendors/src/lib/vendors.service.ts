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
import { DefaultVendorsSortData, Vendor } from './vendors.types';

@Injectable({ providedIn: 'root' })
export class VendorsService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _changes = new Subject<MskChangeEvent<Vendor>>();

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Stream of CRUD changes for in-place list updates
   */
  get changes$(): Observable<MskChangeEvent<Vendor>> {
    return this._changes.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get vendors
   *
   * @param params
   */
  getVendors(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultVendorsSortData.active} ${DefaultVendorsSortData.direction}`,
    },
  ): Observable<MskPageData<Vendor>> {
    return this._httpClient
      .get<MskPagingResponse<Vendor>>(`${this._appConfig.apiEndpoint}/vendor`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new Vendor(item)),
          });
        }),
      );
  }

  /**
   * Get lookup vendors
   */
  getLookupVendors(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultVendorsSortData.active} ${DefaultVendorsSortData.direction}`,
    },
  ): Observable<MskPageData<Vendor>> {
    return this._httpClient
      .get<MskPagingResponse<Vendor>>(`${this._appConfig.apiEndpoint}/vendor`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new Vendor(item)),
          });
        }),
      );
  }

  /**
   * Get vendor
   *
   * @param id
   */
  getVendor(id: number | string): Observable<Vendor> {
    return this._httpClient
      .get<Vendor>(`${this._appConfig.apiEndpoint}/vendor/${id}`)
      .pipe(map((response) => new Vendor(response)));
  }

  /**
   * Create vendor
   *
   * @param vendor
   */
  createVendor(vendor: Vendor): Observable<Vendor> {
    return this._httpClient.post<Vendor>(`${this._appConfig.apiEndpoint}/vendor`, vendor).pipe(
      map((response) => new Vendor(response)),
      tap((vendor) => this._changes.next({ type: 'create', item: vendor })),
    );
  }

  /**
   * Update vendor
   *
   * @param vendor
   */
  updateVendor(vendor: Vendor): Observable<Vendor> {
    return this._httpClient.patch<Vendor>(`${this._appConfig.apiEndpoint}/vendor/${vendor.id}`, vendor).pipe(
      map((response) => new Vendor(response)),
      tap((vendor) => this._changes.next({ type: 'update', item: vendor })),
    );
  }

  /**
   * Delete vendor
   *
   * @param vendor
   */
  deleteVendor(vendor: Vendor): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this._appConfig.apiEndpoint}/vendor/${vendor.id}`).pipe(
      map((response) => response),
      tap(() => this._changes.next({ type: 'delete', id: vendor.id })),
    );
  }
}
