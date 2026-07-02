import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { MskUtilsService } from '@msk/shared/services/utils';
import { BehaviorSubject, map, Observable, ReplaySubject, startWith, tap, withLatestFrom } from 'rxjs';
import { CreateStoreRequest, IStoreResponse, Store } from './store.types';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private _httpClient = inject(HttpClient);
  private _appConfig = inject(MSK_APP_CONFIG);
  private _mskUtilsService = inject(MskUtilsService);

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

        this.currentStore =
          (this.currentStore ? filteredStore.find((x) => x.id === this.currentStore?.id) : filteredStore[0]) ?? null;
      }),
      tap((stores) => {
        this._stores.next(stores);
      }),
    );
  }

  /**
   * Create a store
   *
   * @param payload
   */
  create(payload: CreateStoreRequest): Observable<Store> {
    return this._httpClient.post<IStoreResponse>(`${this._appConfig.apiEndpoint}/store`, payload).pipe(
      map((response) => new Store(response)),
      withLatestFrom(this.stores$.pipe(startWith([] as Store[]))),
      tap(([store, stores]) => {
        const updatedStores = stores.some((item) => item.id === store.id)
          ? stores.map((item) => (item.id === store.id ? store : item))
          : [...stores, store];

        this._stores.next(updatedStores);
        this.currentStore = store;
      }),
      map(([store]) => store),
    );
  }

  /**
   * Upload store logo
   *
   * @param storeId
   * @param file
   */
  uploadStoreLogo(storeId: number, file: File): Observable<Store> {
    const formData = new FormData();
    formData.append('logo', file);

    return this._httpClient
      .patch<IStoreResponse>(`${this._appConfig.apiEndpoint}/store/${storeId}/logo`, formData)
      .pipe(
        map((response) => new Store(response)),
        withLatestFrom(this.stores$.pipe(startWith([] as Store[]))),
        tap(([store, stores]) => {
          const updatedStores = stores.some((item) => item.id === store.id)
            ? stores.map((item) => (item.id === store.id ? store : item))
            : [...stores, store];

          this._stores.next(updatedStores);

          if (this.currentStore?.id === store.id) {
            this.currentStore = store;
          }
        }),
        map(([store]) => store),
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
      localStorage.setItem('currentStoreToken', this._mskUtilsService.encodeBase64Json(value));
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
      return this._mskUtilsService.decodeBase64Json(data ?? '');
    } catch {
      return null;
    }
  }
}
