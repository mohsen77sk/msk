import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MainUserService } from '@msk/main/shell/core/user';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from './auth.utils';

@Injectable({ providedIn: 'root' })
export class MainAuthService {
  private _authenticated = false;
  private _httpClient = inject(HttpClient);
  private _userService = inject(MainUserService);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { email: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError(() => 'User is already logged in.');
    }

    return this._httpClient.post('api/auth/sign-in', credentials).pipe(
      switchMap((response: any) => {
        // Store the access token in the local storage
        this.accessToken = response.accessToken;

        // Set the authenticated flag to true
        this._authenticated = true;

        // Store the user on the user service
        this._userService.user = response.user;

        // Return a new observable with the response
        return of(response);
      })
    );
  }

  /**
   * Sign out
   */
  signOut(): Observable<boolean> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');

    // Set the authenticated flag to false
    this._authenticated = false;

    // Return the observable
    return of(true);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }

    // Check the access token availability
    if (!this.accessToken) {
      return of(false);
    }

    // Check the access token expire date
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    return of(true);
  }
}
