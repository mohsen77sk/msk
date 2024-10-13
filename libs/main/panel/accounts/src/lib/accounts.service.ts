import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { MskPagingResponse, MskPagination } from '@msk/shared/data-access';
import { DefaultAccountSortDirection, DefaultAccountSortId, Account } from './accounts.types';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _pagination: BehaviorSubject<MskPagination | null> = new BehaviorSubject<MskPagination | null>(null);
  private _accounts: BehaviorSubject<Account[] | null> = new BehaviorSubject<Account[] | null>(null);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for pagination
   */
  get pagination$(): Observable<MskPagination | null> {
    return this._pagination.asObservable();
  }

  /**
   * Getter for accounts
   */
  get _accounts$(): Observable<Account[] | null> {
    return this._accounts.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get accounts
   *
   * @param page
   * @param pageSize
   * @param sortBy
   */
  getAccounts(
    page = 1,
    pageSize = 10,
    sortBy = `${DefaultAccountSortId} ${DefaultAccountSortDirection}`
  ): Observable<{ pagination: MskPagination; items: Account[] }> {
    return this._httpClient
      .get<MskPagingResponse<Account>>(`${this._appConfig.apiEndpoint}/api/account/all`, {
        params: { page, pageSize, sortBy },
      })
      .pipe(
        map((response) => ({
          pagination: new MskPagination(response),
          items: response.items.map((row) => new Account(row)),
        })),
        tap((response) => {
          this._pagination.next(response.pagination);
          this._accounts.next(response.items);
        })
      );
  }
}
