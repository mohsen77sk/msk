import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import {
  MskPagingResponse,
  MskLookupResponse,
  MskPageData,
  EmptyPageData,
  MskPagingRequest,
} from '@msk/shared/data-access';
import {
  DefaultAccountSortDirection,
  DefaultAccountSortId,
  Account,
  ICreateAccount,
  IUpdateAccount,
  ICloseAccount,
  IBalanceAccount,
  AccountTransaction,
  ICreateAccountTransaction,
  IUpdateAccountTransaction,
} from './accounts.types';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _accounts: BehaviorSubject<MskPageData<Account>> = new BehaviorSubject<MskPageData<Account>>(EmptyPageData);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for accounts
   */
  get accounts$(): Observable<MskPageData<Account>> {
    return this._accounts.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get accounts
   *
   * @param params
   */
  getAccounts(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultAccountSortId} ${DefaultAccountSortDirection}`,
    }
  ): Observable<MskPageData<Account>> {
    return this._httpClient
      .get<MskPagingResponse<Account>>(`${this._appConfig.apiEndpoint}/api/account/all`, { params })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new Account(item)),
          });
        }),
        tap((response) => this._accounts.next(response))
      );
  }

  /**
   * Get lookup accounts
   */
  getLookupAccounts(): Observable<MskLookupResponse> {
    return this._httpClient
      .get<MskLookupResponse>(`${this._appConfig.apiEndpoint}/api/account/lookup`)
      .pipe(map((response) => response));
  }

  /**
   * Get lookup account types
   */
  getLookupAccountTypes(): Observable<MskLookupResponse> {
    return this._httpClient
      .get<MskLookupResponse>(`${this._appConfig.apiEndpoint}/api/accountType/lookup`)
      .pipe(map((response) => response));
  }

  /**
   * Get account
   *
   * @param id
   */
  getAccount(id: number | string): Observable<Account> {
    return this._httpClient
      .get<Account>(`${this._appConfig.apiEndpoint}/api/account/${id}`)
      .pipe(map((response) => new Account(response)));
  }

  /**
   * Get balance account
   *
   * @param id
   */
  getBalanceAccount(id: number | string): Observable<IBalanceAccount> {
    return this._httpClient
      .get<IBalanceAccount>(`${this._appConfig.apiEndpoint}/api/account/${id}/balance`)
      .pipe(map((response) => response));
  }

  /**
   * Get account
   *
   * @param id
   */
  getAccountWithBalance(id: number | string): Observable<Account> {
    return forkJoin([this.getAccount(id), this.getBalanceAccount(id)]).pipe(
      map((value) => new Account({ ...value[0], ...value[1] } as Account))
    );
  }

  /**
   * Create account
   *
   * @param account
   */
  createAccount(account: ICreateAccount): Observable<Account> {
    return this._httpClient
      .post<Account>(`${this._appConfig.apiEndpoint}/api/account`, account)
      .pipe(map((response) => new Account(response)));
  }

  /**
   * Update account
   *
   * @param account
   */
  updateAccount(account: IUpdateAccount): Observable<Account> {
    return this._httpClient.put<Account>(`${this._appConfig.apiEndpoint}/api/account`, account).pipe(
      map((response) => new Account(response)),
      // Update the accounts
      tap((newAccount) => {
        if (this._accounts.value) {
          const index = this._accounts.value.items.findIndex((x) => x.id === newAccount.id) ?? 0;
          this._accounts.value.items[index] = newAccount;
          this._accounts.next(this._accounts.value);
        }
      })
    );
  }

  /**
   * Close account
   *
   * @param account
   */
  closeAccount(account: ICloseAccount): Observable<Account> {
    return this._httpClient.post<Account>(`${this._appConfig.apiEndpoint}/api/account/close`, account).pipe(
      map((response) => new Account({ ...response, balance: 0 } as Account)),
      // Update the accounts
      tap((newAccount) => {
        if (this._accounts.value) {
          const index = this._accounts.value.items.findIndex((x) => x.id === newAccount.id) ?? 0;
          this._accounts.value.items[index] = newAccount;
          this._accounts.next(this._accounts.value);
        }
      })
    );
  }

  /**
   * Create account transaction
   *
   * @param transaction
   */
  createAccountTransaction(transaction: ICreateAccountTransaction): Observable<AccountTransaction> {
    return this._httpClient
      .post<AccountTransaction>(`${this._appConfig.apiEndpoint}/api/accountTransaction`, transaction)
      .pipe(map((response) => new AccountTransaction(response)));
  }

  /**
   * Update account transaction
   *
   * @param transaction
   */
  updateAccountTransaction(transaction: IUpdateAccountTransaction): Observable<AccountTransaction> {
    return this._httpClient
      .put<AccountTransaction>(`${this._appConfig.apiEndpoint}/api/accountTransaction`, transaction)
      .pipe(map((response) => new AccountTransaction(response)));
  }

  /**
   * Delete account transaction
   *
   * @param transaction
   */
  deleteAccountTransaction(transactionId: number): Observable<boolean> {
    return this._httpClient
      .delete<boolean>(`${this._appConfig.apiEndpoint}/api/accountTransaction/${transactionId}`)
      .pipe(map((response) => response));
  }
}
