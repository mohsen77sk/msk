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
  MskLookupItem,
  MskLookupResponse,
} from '@msk/shared/data-access';
import { Customer, DefaultCustomersSortDirection, DefaultCustomersSortId } from './customers.types';

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
   * @param params
   */
  getCustomers(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultCustomersSortId} ${DefaultCustomersSortDirection}`,
    }
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
        tap((response) => this._customers.next(response))
      );
  }

  /**
   * Get lookup customers
   */
  getLookupCustomers(): Observable<MskLookupResponse> {
    return this._httpClient
      .get<MskPageData<Customer>>(`${this._appConfig.apiEndpoint}/customer`, {
        params: convertToMirzaPagingRequest({
          page: 1,
          pageSize: 50,
          sortBy: `${DefaultCustomersSortId} ${DefaultCustomersSortDirection}`,
        }),
      })
      .pipe(map((x) => x.items.map((x) => ({ id: x.id, name: x.name } as MskLookupItem))));
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
    return this._httpClient
      .post<Customer>(`${this._appConfig.apiEndpoint}/customer`, customer)
      .pipe(map((response) => new Customer(response)));
  }

  /**
   * Update customer
   *
   * @param customer
   */
  updateCustomer(customer: Customer): Observable<Customer> {
    return this._httpClient.patch<Customer>(`${this._appConfig.apiEndpoint}/customer/${customer.id}`, customer).pipe(
      map((response) => new Customer(response)),
      // Update the customers
      tap((newCustomer) => {
        if (this._customers.value) {
          const index = this._customers.value.items.findIndex((x) => x.id === newCustomer.id) ?? 0;
          this._customers.value.items[index] = newCustomer;
          this._customers.next(this._customers.value);
        }
      })
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
      // remove the customers
      tap(() => {
        if (this._customers.value) {
          const index = this._customers.value.items.findIndex((x) => x.id === customer.id);
          if (index > -1) {
            this._customers.value.items.splice(index, 1);
            this._customers.next(this._customers.value);
          }
        }
      })
    );
  }
}
