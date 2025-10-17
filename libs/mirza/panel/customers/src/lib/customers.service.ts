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
  MskLookupItem,
} from '@msk/shared/data-access';
import { Customer, DefaultCustomersSortData } from './customers.types';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _changes = new Subject<MskChangeEvent<Customer>>();

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Stream of CRUD changes for in-place list updates
   */
  get changes$(): Observable<MskChangeEvent<Customer>> {
    return this._changes.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get customers
   *
   * @param params
   */
  getCustomers(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultCustomersSortData.active} ${DefaultCustomersSortData.direction}`,
    },
  ): Observable<MskPageData<Customer>> {
    return this._httpClient
      .get<MskPagingResponse<Customer>>(`${this._appConfig.apiEndpoint}/customer`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new Customer(item)),
          });
        }),
      );
  }

  /**
   * Get lookup customers
   */
  getLookupCustomers(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultCustomersSortData.active} ${DefaultCustomersSortData.direction}`,
    },
  ): Observable<MskPageData<MskLookupItem>> {
    return this._httpClient
      .get<MskPagingResponse<Customer>>(`${this._appConfig.apiEndpoint}/customer`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => ({ id: item.id, name: item.name }) as MskLookupItem),
          });
        }),
      );
  }

  /**
   * Get customer
   *
   * @param id
   */
  getCustomer(id: number | string): Observable<Customer> {
    return this._httpClient
      .get<Customer>(`${this._appConfig.apiEndpoint}/customer/${id}`)
      .pipe(map((response) => new Customer(response)));
  }

  /**
   * Create customer
   *
   * @param customer
   */
  createCustomer(customer: Customer): Observable<Customer> {
    return this._httpClient.post<Customer>(`${this._appConfig.apiEndpoint}/customer`, customer).pipe(
      map((response) => new Customer(response)),
      tap((customer) => this._changes.next({ type: 'create', item: customer })),
    );
  }

  /**
   * Update customer
   *
   * @param customer
   */
  updateCustomer(customer: Customer): Observable<Customer> {
    return this._httpClient.patch<Customer>(`${this._appConfig.apiEndpoint}/customer/${customer.id}`, customer).pipe(
      map((response) => new Customer(response)),
      tap((customer) => this._changes.next({ type: 'update', item: customer })),
    );
  }

  /**
   * Delete customer
   *
   * @param customer
   */
  deleteCustomer(customer: Customer): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this._appConfig.apiEndpoint}/customer/${customer.id}`).pipe(
      map((response) => response),
      tap(() => this._changes.next({ type: 'delete', id: customer.id })),
    );
  }
}
