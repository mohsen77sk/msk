import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { User } from './user.types';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _httpClient = inject(HttpClient);
  private _appConfig = inject(MSK_APP_CONFIG);
  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for user
   */
  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get the current logged in user data
   */
  get(): Observable<User> {
    return this._httpClient.get<{ data: User }>(`${this._appConfig.apiEndpoint}/auth/me`).pipe(
      map((res) => new User(res.data)),
      tap((user) => {
        this._user.next(user);
      })
    );
  }
}
