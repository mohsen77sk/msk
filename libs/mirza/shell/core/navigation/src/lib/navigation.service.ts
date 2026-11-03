import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, ReplaySubject, combineLatest, map, tap } from 'rxjs';
import { StoreAccessService } from '@msk/mirza/shell/core/store';
import { Navigation } from './navigation.types';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private _httpClient = inject(HttpClient);
  private _translocoService = inject(TranslocoService);
  private _storeAccessService = inject(StoreAccessService);
  private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for navigation, without the pages the caller may not open in the current store
   */
  get navigation$(): Observable<Navigation> {
    return combineLatest([this._navigation, this._storeAccessService.access$]).pipe(
      map(([navigation]) => this._withoutClosedPages(navigation)),
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get all navigation data
   */
  get(): Observable<Navigation> {
    const lang_id = this._translocoService.getActiveLang();
    return this._httpClient.get<Navigation>(`assets/api/${lang_id}/navigation.json`).pipe(
      tap((navigation) => {
        this._navigation.next(navigation);
      }),
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * @param items
   * @private
   */
  private _withoutClosedPages(items: Navigation): Navigation {
    return items
      .filter((item) => !item.link || this._storeAccessService.canOpen(item.link))
      .map((item) => (item.children ? { ...item, children: this._withoutClosedPages(item.children) } : item));
  }
}
