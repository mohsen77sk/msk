import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { MskHttpCacheService } from '@msk/shared/services/http-cache';
import { scopeLoader } from '@msk/shared/utils/transloco';
import { TranslocoService } from '@jsverse/transloco';
import {
  MskPageData,
  MskPagingRequest,
  MskPagingResponse,
  convertToMirzaPagingRequest,
  MskChangeEvent,
  MskDialogData,
} from '@msk/shared/data-access';
import {
  DefaultExpenseSortData,
  DefaultExpenseCategorySortData,
  Expense,
  ExpenseCategory,
  ICreateExpense,
} from './expenses.types';
import { ExpensesCardDetailsComponent } from './card/details/details.component';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _matDialog = inject(MatDialog);
  private _httpClient = inject(HttpClient);
  private _httpCache = inject(MskHttpCacheService);
  private _translocoService = inject(TranslocoService);

  // Private
  private _cacheKey = '/expenses';
  private _changes = new Subject<MskChangeEvent<Expense>>();

  /**
   * Constructor
   */
  constructor() {
    this.changes$
      .pipe(
        tap(() => {
          this._httpCache.invalidatePrefix(this._cacheKey);
        }),
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Stream of CRUD changes for in-place list updates
   */
  get changes$(): Observable<MskChangeEvent<Expense>> {
    return this._changes.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get expenses
   */
  getExpenses(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultExpenseSortData.active} ${DefaultExpenseSortData.direction}`,
    },
  ): Observable<MskPageData<Expense>> {
    const cacheKey = this._httpCache.buildCacheKey(this._cacheKey, params);
    return this._httpCache.get(cacheKey, () =>
      this._httpClient
        .get<MskPagingResponse<Expense>>(`${this._appConfig.apiEndpoint}/expenses`, {
          params: convertToMirzaPagingRequest(params),
        })
        .pipe(
          map((response) => {
            return new MskPageData({
              ...response,
              items: response.items.map((item) => new Expense(item)),
            });
          }),
        ),
    );
  }

  /**
   * Get expense categories (used by the category autocomplete on the create/edit form)
   */
  getExpenseCategories(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultExpenseCategorySortData.active} ${DefaultExpenseCategorySortData.direction}`,
    },
  ): Observable<MskPageData<ExpenseCategory>> {
    return this._httpClient
      .get<MskPagingResponse<ExpenseCategory>>(`${this._appConfig.apiEndpoint}/expenses/category`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new ExpenseCategory(item)),
          });
        }),
      );
  }

  /**
   * Get expense
   *
   * @param id
   */
  getExpense(id: number | string): Observable<Expense> {
    return this._httpClient
      .get<Expense>(`${this._appConfig.apiEndpoint}/expenses/${id}`)
      .pipe(map((response) => new Expense(response)));
  }

  /**
   * Create expense
   *
   * @param expense
   */
  createExpense(expense: ICreateExpense): Observable<Expense> {
    return this._httpClient.post<Expense>(`${this._appConfig.apiEndpoint}/expenses`, expense).pipe(
      map((response) => new Expense(response)),
      tap((expense) => this._changes.next({ type: 'create', item: expense })),
    );
  }

  /**
   * Update expense
   *
   * @param expense
   */
  updateExpense(expense: ICreateExpense): Observable<Expense> {
    return this._httpClient.patch<Expense>(`${this._appConfig.apiEndpoint}/expenses/${expense.id}`, expense).pipe(
      map((response) => new Expense(response)),
      tap((expense) => this._changes.next({ type: 'update', item: expense })),
    );
  }

  /**
   * Delete expense
   *
   * @param expense
   */
  deleteExpense(expense: Expense): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this._appConfig.apiEndpoint}/expenses/${expense.id}`).pipe(
      map((response) => response),
      tap(() => this._changes.next({ type: 'delete', id: expense.id })),
    );
  }

  /**
   * Open expense dialog
   *
   * @param data
   */
  openExpenseDialog(data: MskDialogData<Expense | undefined>): Observable<MatDialogRef<ExpensesCardDetailsComponent>> {
    const activeLang = this._translocoService.getActiveLang();

    return this._translocoService
      .load(`expenses/${activeLang}`, {
        inlineLoader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`), 'i18n', 'expenses'),
      })
      .pipe(
        map(() =>
          this._matDialog.open(ExpensesCardDetailsComponent, {
            autoFocus: data.action() !== 'view',
            disableClose: data.action() !== 'view',
            data: {
              action: data.action,
              item: data.item,
            },
          }),
        ),
      );
  }
}
