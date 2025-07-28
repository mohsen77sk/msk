import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, debounceTime, filter, Observable, Subscription, tap } from 'rxjs';
import { CustomersService } from './customers.service';
import { Customer } from './customers.types';

export class CustomerDataSource extends DataSource<Customer | undefined> {
  private _total = 1;
  private _pageSize = 10;
  private _currentSearch = '';
  private _cachedData = Array.from<Customer | undefined>({ length: this._total });
  private _fetchedPages = new Set<number>();
  private readonly _dataStream = new BehaviorSubject<(Customer | undefined)[]>(this._cachedData);
  private readonly _subscription = new Subscription();

  /**
   * This class is a data source for the customer collection.
   *
   * @param api
   * @param search
   */
  constructor(public api: CustomersService, public search?: Observable<unknown>) {
    super();
  }

  /**
   * Connect the data source to the collection viewer.
   * This method is called by the collection viewer to get the data to display.
   */
  connect(collectionViewer: CollectionViewer): Observable<(Customer | undefined)[]> {
    this._subscription.add(
      collectionViewer.viewChange.subscribe((range) => {
        const startPage = this._getPageForIndex(range.start);
        const endPage = this._getPageForIndex(range.end);
        for (let i = startPage; i <= endPage; i++) {
          this._fetchPage(i);
        }
      })
    );
    this._subscription.add(
      this.search
        ?.pipe(
          debounceTime(300),
          filter((value) => typeof value === 'string' || value === null)
        )
        .subscribe((value) => {
          this._currentSearch = value ?? '';
          this._fetchedPages.clear();
          this._cachedData = Array.from<Customer | undefined>({ length: this._total });
          this._dataStream.next(this._cachedData);
          this._fetchPage(0);
        })
    );
    return this._dataStream;
  }

  /**
   * Disconnect the data source.
   * This method is called by the collection viewer when it no longer needs the data source.
   */
  disconnect(): void {
    this._subscription.unsubscribe();
  }

  /**
   * Get the page number for a given index.
   */
  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  /**
   * Fetch data
   */
  private _fetchPage(pageIndex: number) {
    if (this._fetchedPages.has(pageIndex)) {
      return;
    }
    this._fetchedPages.add(pageIndex);

    this.api
      .getLookupCustomers(pageIndex + 1, this._pageSize, this._currentSearch)
      .pipe(
        tap((pageData) => {
          if (this._total !== pageData.total) {
            this._total = pageData.total;
            this._cachedData = Array.from<Customer | undefined>({ length: this._total });
          }
          this._cachedData.splice(pageIndex * this._pageSize, this._pageSize, ...pageData.items);
          this._dataStream.next(this._cachedData);
        })
      )
      .subscribe();
  }
}
