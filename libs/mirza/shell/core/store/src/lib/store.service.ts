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
  private _currentStore: BehaviorSubject<Store | null> = new BehaviorSubject<Store | null>(null);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter & Setter for current store
   *
   * @param value
   */
  set currentStore(value: Store | null) {
    this._currentStore.next(value);
  }
  get currentStore(): Store | null {
    return this._currentStore.getValue();
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
        this._stores.next(stores);
      })
    );
  }
}
