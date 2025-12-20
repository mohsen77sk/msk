import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs';
import { IStoreResponse, Store } from './store.types';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private _httpClient = inject(HttpClient);
  private _appConfig = inject(MSK_APP_CONFIG);

  private _stores: ReplaySubject<Store[]> = new ReplaySubject<Store[]>(1);
  private _currentStore: BehaviorSubject<Store | null>;

  /**
   * Constructor
   */
  constructor() {
    this._currentStore = new BehaviorSubject(this._getFromStorage());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for current store
   *
   * @param value
   */
  set currentStore(value: Store | null) {
    // Set the new config
    this._setToStorage(value);

    // Execute the observable
    this._currentStore.next(value);
  }

  get currentStore(): Store | null {
    return this._currentStore.value;
  }

  /**
   * Getter for current store
   */
  get currentStore$(): Observable<Store | null> {
    return this._currentStore.asObservable();
  }

  /**
   * Getter for stores
   */
  get stores$(): Observable<Store[]> {
    return this._stores.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get all stores
   */
  getAll(): Observable<Store[]> {
    return this._httpClient.get<{ items: IStoreResponse[] }>(`${this._appConfig.apiEndpoint}/store`).pipe(
      map((response) => response.items.map((row) => new Store(row))),
      tap((stores) => {
        const filteredStore = stores.filter((x) => x.isActive);

        if (this.currentStore === null || !filteredStore.some((x) => x.id === this.currentStore?.id)) {
          this.currentStore = filteredStore.length > 0 ? filteredStore[0] : null;
        }
      }),
      tap((stores) => {
        this._stores.next(stores);
      }),
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set value to storage
   *
   * @param value
   * @private
   */
  private _setToStorage(value: Store | null): void {
    if (value) {
      localStorage.setItem('currentStoreToken', btoa(JSON.stringify(value)));
    } else {
      localStorage.removeItem('currentStoreToken');
    }
  }

  /**
   * Get value from storage
   *
   * @private
   */
  private _getFromStorage(): Store | null {
    const data = localStorage.getItem('currentStoreToken');
    try {
      return JSON.parse(atob(data ?? ''));
    } catch {
      return null;
    }
  }
}
