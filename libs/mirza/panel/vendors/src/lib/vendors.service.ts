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
import { DefaultVendorsSortDirection, DefaultVendorsSortId, Vendor } from './vendors.types';

@Injectable({ providedIn: 'root' })
export class VendorsService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _vendors: BehaviorSubject<MskPageData<Vendor>> = new BehaviorSubject<MskPageData<Vendor>>(EmptyPageData);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for vendors
   */
  get vendors$(): Observable<MskPageData<Vendor>> {
    return this._vendors.asObservable();
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
      sortBy: `${DefaultVendorsSortId} ${DefaultVendorsSortDirection}`,
    }
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
        tap((response) => this._vendors.next(response))
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
    return this._httpClient
      .post<Vendor>(`${this._appConfig.apiEndpoint}/vendor`, vendor)
      .pipe(map((response) => new Vendor(response)));
  }

  /**
   * Update vendor
   *
   * @param vendor
   */
  updateVendor(vendor: Vendor): Observable<Vendor> {
    return this._httpClient.patch<Vendor>(`${this._appConfig.apiEndpoint}/vendor/${vendor.id}`, vendor).pipe(
      map((response) => new Vendor(response)),
      // Update the vendors
      tap((newVendor) => {
        if (this._vendors.value) {
          const index = this._vendors.value.items.findIndex((x) => x.id === newVendor.id) ?? 0;
          this._vendors.value.items[index] = newVendor;
          this._vendors.next(this._vendors.value);
        }
      })
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
      // remove the vendor
      tap(() => {
        if (this._vendors.value) {
          const index = this._vendors.value.items.findIndex((x) => x.id === vendor.id);
          if (index > -1) {
            this._vendors.value.items.splice(index, 1);
            this._vendors.next(this._vendors.value);
          }
        }
      })
    );
  }
}
