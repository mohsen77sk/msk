import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { PAGE_PERMISSIONS, StoreAccess, StorePermission } from './store-access.types';

@Injectable({ providedIn: 'root' })
export class StoreAccessService {
  private _httpClient = inject(HttpClient);
  private _appConfig = inject(MSK_APP_CONFIG);

  private _access$ = new ReplaySubject<StoreAccess>(1);
  private _access = signal<StoreAccess | null>(null);

  /**
   * The caller's role and permissions in the current store
   */
  readonly access = this._access.asReadonly();
  readonly permissions = computed(() => new Set(this._access()?.permissions ?? []));

  get access$(): Observable<StoreAccess> {
    return this._access$.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Load the access of the current store (the Store-Id header). Call after the current store changes.
   */
  load(): Observable<StoreAccess> {
    return this._httpClient.get<StoreAccess>(`${this._appConfig.apiEndpoint}/store-member/me`).pipe(
      tap((access) => {
        this._access.set(access);
        this._access$.next(access);
      }),
    );
  }

  /**
   * @param permission
   */
  can(permission: StorePermission): boolean {
    return this.permissions().has(permission);
  }

  /**
   * Whether a panel page (by its link) is open to the caller
   *
   * @param link e.g. '/panel/products'
   */
  canOpen(link: string): boolean {
    const permission = PAGE_PERMISSIONS[link];
    return !permission || this.can(permission);
  }

  /**
   * Where to land: the dashboard, else the POS, else the sales list (open to every member)
   */
  homeUrl(): string {
    if (this.can('reports.view')) return '/panel/dashboard';
    if (this.can('sales.create')) return '/pos';
    return '/panel/sales';
  }
}
