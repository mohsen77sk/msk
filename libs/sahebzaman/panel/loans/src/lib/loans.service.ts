import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import {
  MskPagingResponse,
  MskLookupResponse,
  MskPageData,
  EmptyPageData,
  MskPagingRequest,
} from '@msk/shared/data-access';
import { DefaultLoanSortDirection, DefaultLoanSortId, Loan, ICreateLoan, IUpdateLoan } from './loans.types';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _loans: BehaviorSubject<MskPageData<Loan>> = new BehaviorSubject<MskPageData<Loan>>(EmptyPageData);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for loans
   */
  get loans$(): Observable<MskPageData<Loan>> {
    return this._loans.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get loans
   *
   * @param params
   */
  getLoans(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultLoanSortId} ${DefaultLoanSortDirection}`,
    }
  ): Observable<MskPageData<Loan>> {
    return this._httpClient
      .get<MskPagingResponse<Loan>>(`${this._appConfig.apiEndpoint}/api/loan/all`, { params })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new Loan(item)),
          });
        }),
        tap((response) => this._loans.next(response))
      );
  }
}
