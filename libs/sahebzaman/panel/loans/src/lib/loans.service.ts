import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import {
  MskPagingResponse,
  MskLookupResponse,
  MskPageData,
  MskPagingRequest,
  MskChangeEvent,
} from '@msk/shared/data-access';
import { DefaultLoansSortData, Loan, ICreateLoan, IUpdateLoan } from './loans.types';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _changesLoans = new Subject<MskChangeEvent<Loan>>();

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Stream of CRUD changes for in-place list updates
   */
  get changesLoans$(): Observable<MskChangeEvent<Loan>> {
    return this._changesLoans.asObservable();
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
    return this._httpClient.post<Loan>(`${this._appConfig.apiEndpoint}/api/loan`, loan).pipe(
      map((response) => new Loan(response)),
      tap((loan) => this._changesLoans.next({ type: 'create', item: loan })),
    );
  }

  /**
   * Update loan
   *
   * @param loan
   */
  updateLoan(loan: IUpdateLoan): Observable<Loan> {
    return this._httpClient.put<Loan>(`${this._appConfig.apiEndpoint}/api/loan`, loan).pipe(
      map((response) => new Loan(response)),
      tap((loan) => this._changesLoans.next({ type: 'update', item: loan })),
    );
  }
}
