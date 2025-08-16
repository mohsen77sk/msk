import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { User } from './user.types';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _httpClient = inject(HttpClient);
  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter for user
   */
  set user(value: User) {
    this._user.next(value);
  }
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
    return this._httpClient.get<User>('assets/api/user.json').pipe(
      tap((user) => {
        this._user.next(user);
      }),
    );
  }
}
