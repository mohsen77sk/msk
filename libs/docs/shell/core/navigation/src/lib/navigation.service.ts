import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Navigation } from './navigation.types';

@Injectable({ providedIn: 'root' })
export class DocsNavigationService {
  private _httpClient = inject(HttpClient);
  private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for navigation
   */
  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get all navigation data
   */
  get(): Observable<Navigation> {
    return this._httpClient.get<Navigation>('assets/api/navigation.json').pipe(
      tap((navigation) => {
        this._navigation.next(navigation);
      }),
    );
  }
}
