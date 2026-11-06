import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Observable, Subject, expand, map, reduce, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { MskHttpCacheService } from '@msk/shared/services/http-cache';
import { scopeLoader } from '@msk/shared/utils/transloco';
import { TranslocoService } from '@jsverse/transloco';
import { MskChangeEvent, MskDialogData } from '@msk/shared/data-access';
import {
  DefaultProductCategorySortData,
  ProductCategoriesService,
  ProductCategory,
} from '@msk/mirza/panel/product-categories';
import { ISaveQuickNote, QuickNote } from './quick-notes.types';
import { QuickNotesCardDetailsComponent } from './card/details/details.component';

// The API's largest page
const CATEGORY_PAGE_SIZE = 50;

@Injectable({ providedIn: 'root' })
export class QuickNotesService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _matDialog = inject(MatDialog);
  private _httpClient = inject(HttpClient);
  private _httpCache = inject(MskHttpCacheService);
  private _translocoService = inject(TranslocoService);
  private _productCategoriesService = inject(ProductCategoriesService);

  // Private
  private _cacheKey = '/quick-note';
  private _changes = new Subject<MskChangeEvent<QuickNote>>();

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
   * Stream of CRUD changes; a reorder emits one 'update' per note
   */
  get changes$(): Observable<MskChangeEvent<QuickNote>> {
    return this._changes.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * The store's quick notes, in chip order (not paged: a store has a handful)
   *
   * @param activeOnly only the ones the POS and the sale dialog offer
   */
  getQuickNotes(activeOnly = false): Observable<QuickNote[]> {
    const params: Record<string, string> = activeOnly ? { active: 'true' } : {};
    const cacheKey = this._httpCache.buildCacheKey(this._cacheKey, params);
    return this._httpCache.get(cacheKey, () =>
      this._httpClient
        .get<QuickNote[]>(`${this._appConfig.apiEndpoint}/quick-note`, { params })
        .pipe(map((response) => response.map((item) => new QuickNote(item)))),
    );
  }

  /**
   * Get quick note
   *
   * @param id
   */
  getQuickNote(id: number | string): Observable<QuickNote> {
    return this._httpClient
      .get<QuickNote>(`${this._appConfig.apiEndpoint}/quick-note/${id}`)
      .pipe(map((response) => new QuickNote(response)));
  }

  /**
   * Create quick note
   *
   * @param quickNote
   */
  createQuickNote(quickNote: ISaveQuickNote): Observable<QuickNote> {
    return this._httpClient.post<QuickNote>(`${this._appConfig.apiEndpoint}/quick-note`, quickNote).pipe(
      map((response) => new QuickNote(response)),
      tap((item) => this._changes.next({ type: 'create', item })),
    );
  }

  /**
   * Update quick note
   *
   * @param quickNote
   */
  updateQuickNote(quickNote: ISaveQuickNote & { id: number }): Observable<QuickNote> {
    const { id, ...body } = quickNote;
    return this._httpClient.patch<QuickNote>(`${this._appConfig.apiEndpoint}/quick-note/${id}`, body).pipe(
      map((response) => new QuickNote(response)),
      tap((item) => this._changes.next({ type: 'update', item })),
    );
  }

  /**
   * Save a new chip order
   *
   * @param ids every quick note of the store, in the new order
   */
  reorderQuickNotes(ids: number[]): Observable<QuickNote[]> {
    return this._httpClient.patch<QuickNote[]>(`${this._appConfig.apiEndpoint}/quick-note/order`, { ids }).pipe(
      map((response) => response.map((item) => new QuickNote(item))),
      tap((items) => items.forEach((item) => this._changes.next({ type: 'update', item }))),
    );
  }

  /**
   * Delete quick note
   *
   * @param quickNote
   */
  deleteQuickNote(quickNote: QuickNote): Observable<QuickNote> {
    return this._httpClient
      .delete<QuickNote>(`${this._appConfig.apiEndpoint}/quick-note/${quickNote.id}`)
      .pipe(tap(() => this._changes.next({ type: 'delete', id: quickNote.id })));
  }

  /**
   * Every category of the store, for the scope picker (the API pages at most 50)
   */
  getAllCategories(): Observable<ProductCategory[]> {
    const sortBy = `${DefaultProductCategorySortData.active} ${DefaultProductCategorySortData.direction}`;
    const page = (index: number) =>
      this._productCategoriesService.getProductCategories({ page: index, pageSize: CATEGORY_PAGE_SIZE, sortBy });

    return page(1).pipe(
      expand((response) =>
        (response.pageIndex + 1) * CATEGORY_PAGE_SIZE < response.total && response.items.length
          ? page(response.pageIndex + 2)
          : EMPTY,
      ),
      reduce((all, response) => [...all, ...response.items], [] as ProductCategory[]),
    );
  }

  /**
   * Open quick note dialog
   *
   * @param data
   */
  openQuickNoteDialog(
    data: MskDialogData<QuickNote | undefined>,
  ): Observable<MatDialogRef<QuickNotesCardDetailsComponent>> {
    const activeLang = this._translocoService.getActiveLang();

    return this._translocoService
      .load(`quickNotes/${activeLang}`, {
        inlineLoader: scopeLoader(
          (lang: string, root: string) => import(`./${root}/${lang}.json`),
          'i18n',
          'quickNotes',
        ),
      })
      .pipe(
        map(() =>
          this._matDialog.open(QuickNotesCardDetailsComponent, {
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
