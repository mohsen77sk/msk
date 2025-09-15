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
import { DefaultLoansSortData, Loan, ICreateLoan, IUpdateLoan } from './loans.types';

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
      sortBy: `${DefaultLoansSortData.active} ${DefaultLoansSortData.direction}`,
    },
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
        tap((response) => this._loans.next(response)),
      );
  }

  /**
   * Get lookup loan types
   */
  getLookupLoanTypes(): Observable<MskLookupResponse> {
    return this._httpClient
      .get<MskLookupResponse>(`${this._appConfig.apiEndpoint}/api/loanType/lookup`)
      .pipe(map((response) => response));
  }

  /**
   * Get loan
   *
   * @param id
   */
  getLoan(id: number | string): Observable<Loan> {
    return this._httpClient
      .get<Loan>(`${this._appConfig.apiEndpoint}/api/loan/${id}`)
      .pipe(map((response) => new Loan(response)));
  }

  /**
   * Create loan
   *
   * @param loan
   */
  createLoan(loan: ICreateLoan): Observable<Loan> {
    return this._httpClient
      .post<Loan>(`${this._appConfig.apiEndpoint}/api/loan`, loan)
      .pipe(map((response) => new Loan(response)));
  }

  /**
   * Update loan
   *
   * @param loan
   */
  updateLoan(loan: IUpdateLoan): Observable<Loan> {
    return this._httpClient.put<Loan>(`${this._appConfig.apiEndpoint}/api/loan`, loan).pipe(
      map((response) => new Loan(response)),
      // Update the loans
      tap((newLoan) => {
        if (this._loans.value) {
          const index = this._loans.value.items.findIndex((x) => x.id === newLoan.id) ?? 0;
          this._loans.value.items[index] = newLoan;
          this._loans.next(this._loans.value);
        }
      }),
    );
  }
}
