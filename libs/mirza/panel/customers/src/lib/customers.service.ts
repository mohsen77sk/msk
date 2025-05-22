import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { MskPagingResponse, MskPageData, EmptyPageData } from '@msk/shared/data-access';
import { Customer } from './customers.types';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _customers: BehaviorSubject<MskPageData<Customer>> = new BehaviorSubject<MskPageData<Customer>>(
    EmptyPageData
  );

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for customers
   */
  get customers$(): Observable<MskPageData<Customer>> {
    return this._customers.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get customers
   *
   * @param page
   * @param pageSize
   */
  getCustomers(page = 1, pageSize = 10): Observable<MskPageData<Customer>> {
    return this._httpClient
      .get<MskPagingResponse<Customer>>(`${this._appConfig.apiEndpoint}/customer`, {
        params: { page, take: pageSize },
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new Customer(item)),
          });
        }),
        tap((response) => this._customers.next(response))
      );
  }
}
