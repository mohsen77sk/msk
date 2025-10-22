import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MskPageData } from './pagination.types';
import {
  BehaviorSubject,
  debounceTime,
  EMPTY,
  filter,
  finalize,
  map,
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
  private _pageSize = 25;
  private _currentSort = '';
  private _currentSearch = '';
  private _currentFilter: object | null = null;
  private _cachedData = Array.from<T>({ length: this._total });
  private _fetchedPages = new Set<number>();
  private readonly _dataStream = new BehaviorSubject<T[]>(this._cachedData);
  private readonly _loadingStream = new BehaviorSubject<boolean>(false);
  private readonly _subscription = new Subscription();

  /**
   * constructor
   */
  constructor(
    private fetchPage: FetchPageFn<T>,
    private _sort?: MskSort,
    private _search?: Observable<unknown>,
    private _filter?: Observable<unknown>,
  ) {
    super();
    this._currentSort = _sort?.toString() ?? '';
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Observable that emits the loading state of the data source.
   * Useful for displaying loading indicators in the UI.
   */
  get loading$(): Observable<boolean> {
    return this._loadingStream.asObservable();
  }

  /**
   * Returns the total number of items in the data source.
   */
  get length(): number {
    return this._total;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Connects the data source to the collection viewer.
   * Subscribes to view changes, sort changes, and search changes to fetch and update data accordingly.
   * Returns an observable stream of the current data array.
   */
  connect(collectionViewer: CollectionViewer): Observable<(T | undefined)[]> {
    const viewChanges$ = collectionViewer.viewChange.pipe(
      map((range) => {
        const startPage = this._getPageForIndex(range.start);
        const endPage = this._getPageForIndex(range.end);
        const pages: number[] = [];
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        return pages;
      }),
    );

    // Filter changes (subscribe first so initial filter is applied before first view fetch)
    if (this._filter) {
      this._subscription.add(
        this._filter
          .pipe(
            filter((v) => typeof v === 'object' || v === null),
            tap((v) => {
              this._currentFilter = v ?? null;
              this._resetCache();
            }),
            switchMap(() => this._fetchPage(0)), // switchMap cancels previous requests
          )
          .subscribe(),
      );
    }

    // Sort changes
    this._subscription.add(
      this._sort?.sortChange
        ?.pipe(
          tap((value) => {
            this._currentSort = value.toString();
            this._resetCache();
          }),
          switchMap(() => this._fetchPage(0)), // switchMap cancels previous requests
        )
        .subscribe(),
    );

    // Search changes
    this._subscription.add(
      this._search
        ?.pipe(
          debounceTime(300),
          filter((v) => typeof v === 'string' || v === null),
          tap((v) => {
            this._currentSearch = v ?? '';
            this._resetCache();
          }),
          switchMap(() => this._fetchPage(0)), // switchMap cancels previous requests
        )
        .subscribe(),
    );

    // View changes (scrolling, pagination)
    this._subscription.add(
      viewChanges$
        .pipe(
          switchMap((pages) => {
            // When new pages are requested, previous calls are automatically canceled
            return pages.length ? this._fetchPage(pages[0]) : EMPTY;
          }),
        )
        .subscribe(),
    );

    // Return the observable data stream
    return this._dataStream;
  }

  /**
   * Disconnects the data source by unsubscribing from all subscriptions
   * and completing the data and loading streams to clean up resources.
   */
  disconnect(): void {
    this._subscription.unsubscribe();
    this._dataStream.complete();
    this._loadingStream.complete();
  }

  /**
   * Public: Refresh the current data by clearing cache and fetching first page
   */
  refresh(): void {
    this._resetCache();
    this._subscription.add(this._fetchPage(0).subscribe());
  }

  /**
   * Public: Update first item matching predicate with provided patch item
   */
  updateWhere(match: (x: T) => boolean, patch: T): void {
    const index = this._cachedData.findIndex((x) => x !== undefined && match(x as T));
    if (index >= 0) {
      this._cachedData[index] = patch;
      this._dataStream.next(this._cachedData);
    }
  }

  /**
   * Public: Remove first item matching predicate and update total/stream
   */
  removeWhere(match: (x: T) => boolean): void {
    const index = this._cachedData.findIndex((x) => x !== undefined && match(x as T));
    if (index >= 0) {
      this._cachedData.splice(index, 1);
      this._total = Math.max(0, this._total - 1);
      this._dataStream.next(this._cachedData);
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Calculates the page number for a given item index.
   * @param index The zero-based index of the item in the overall data set.
   * @returns The zero-based page number that contains the item.
   */
  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  /**
   * Fetches a page of data from the backend if it hasn't been fetched yet.
   * Marks the page as fetched, sets loading state, and updates the cache and data stream.
   * @param pageIndex The zero-based index of the page to fetch
   * @returns Observable that completes when the page is fetched and cache is updated
   */
  private _fetchPage(pageIndex: number): Observable<unknown> {
    if (this._fetchedPages.has(pageIndex)) {
      // If the page has already been fetched, return EMPTY observable
      return EMPTY;
    }
    this._fetchedPages.add(pageIndex);

    // Set loading state to true
    this._loadingStream.next(true);

    // Fetch the page data using the provided fetchPage function
    return this.fetchPage({
      page: pageIndex + 1,
      pageSize: this._pageSize,
      sortBy: this._currentSort,
      search: this._currentSearch,
      ...this._currentFilter,
    }).pipe(
      tap((pageData) => {
        // If the total number of items has changed, update the cache size
        if (this._total !== pageData.total) {
          this._total = pageData.total;
          this._cachedData = Array.from<T>({ length: this._total });
        }
        // Insert the fetched items into the correct position in the cache
        this._cachedData.splice(pageIndex * this._pageSize, this._pageSize, ...(pageData.items as T[]));
        // Emit the updated cache to the data stream
        return this._dataStream.next(this._cachedData);
      }),
      // Set loading state to false when done
      finalize(() => this._loadingStream.next(false)),
    );
  }

  /**
   * Resets the cached data and fetched pages.
   * Clears fetched pages, and reinitializes the cache array.
   * Emits the updated (empty) cache to the data stream.
   */
  private _resetCache(): void {
    if (this._total === 0) this._total = 1;
    this._fetchedPages.clear();
    this._cachedData = Array.from<T>({ length: this._total });
    this._dataStream.next(this._cachedData);
  }
}
