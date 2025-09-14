import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MskPageData } from './pagination.types';
import {
  BehaviorSubject,
  debounceTime,
  EMPTY,
  filter,
  map,
  mergeMap,
  Observable,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { MskPagingRequest } from './request.types';
import { MskSort } from './sort.types';

export type FetchPageFn<T> = (params: MskPagingRequest) => Observable<MskPageData<T>>;

export class MskDataSource<T> extends DataSource<T | undefined> {
  private _total = 1;
  private _pageSize = 10;
  private _currentSort = '';
  private _currentSearch = '';
  private _cachedData = Array.from<T>({ length: this._total });
  private _fetchedPages = new Set<number>();
  private readonly _dataStream = new BehaviorSubject<T[]>(this._cachedData);
  private readonly _subscription = new Subscription();

  constructor(
    private fetchPage: FetchPageFn<T>,
    public sortBy?: Observable<MskSort>,
    public search?: Observable<unknown>,
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(T | undefined)[]> {
    this._subscription.add(
      collectionViewer.viewChange
        .pipe(
          map((range) => {
            const startPage = this._getPageForIndex(range.start);
            const endPage = this._getPageForIndex(range.end);
            const pagesToFetch: number[] = [];
            for (let i = startPage; i <= endPage; i++) {
              pagesToFetch.push(i);
            }
            return pagesToFetch;
          }),
          mergeMap((pages) => pages.map((page) => this._fetchPage(page))),
          mergeMap((requests) => requests),
        )
        .subscribe(),
    );
    this._subscription.add(
      this.sortBy
        ?.pipe(
          map((value) => {
            this._currentSort = value.toString();
            this._fetchedPages.clear();
            this._cachedData = Array.from<T>({ length: this._total });
            this._dataStream.next(this._cachedData);
          }),
          switchMap(() => this._fetchPage(0)),
        )
        .subscribe(),
    );
    this._subscription.add(
      this.search
        ?.pipe(
          debounceTime(300),
          filter((value) => typeof value === 'string' || value === null),
          map((value) => {
            this._currentSearch = value ?? '';
            this._fetchedPages.clear();
            this._cachedData = Array.from<T>({ length: this._total });
            this._dataStream.next(this._cachedData);
          }),
          switchMap(() => this._fetchPage(0)),
        )
        .subscribe(),
    );
    return this._dataStream;
  }

  disconnect(): void {
    this._subscription.unsubscribe();
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  private _fetchPage(pageIndex: number): Observable<unknown> {
    if (this._fetchedPages.has(pageIndex)) {
      return EMPTY;
    }
    this._fetchedPages.add(pageIndex);

    // pageIndex + 1, this._pageSize, this._currentSearch
    return this.fetchPage({
      page: pageIndex + 1,
      pageSize: this._pageSize,
      sortBy: this._currentSort,
      search: this._currentSearch,
    }).pipe(
      tap((pageData) => {
        if (this._total !== pageData.total) {
          this._total = pageData.total;
          this._cachedData = Array.from<T>({ length: this._total });
        }
        this._cachedData.splice(pageIndex * this._pageSize, this._pageSize, ...(pageData.items as T[]));
        return this._dataStream.next(this._cachedData);
      }),
    );
  }
}
