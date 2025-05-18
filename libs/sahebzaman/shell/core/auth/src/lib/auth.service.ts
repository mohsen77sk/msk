import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { catchError, finalize, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from './auth.utils';
import { AUTH_TOKEN, LoginRequest, LoginResponse } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated = false;
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem(AUTH_TOKEN, token);
  }

  get accessToken(): string {
    return localStorage.getItem(AUTH_TOKEN) ?? '';
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: LoginRequest): Observable<LoginResponse> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError(() => 'User is already logged in.');
    }

    return this._httpClient.post<LoginResponse>(`${this._appConfig.apiEndpoint}/auth/login`, credentials).pipe(
      switchMap((response) => {
        // If the user don't need two factor authentication...
        if (!response.requiresTwoFactor) {
          // Store the access token in the local storage
          this.accessToken = response.accessToken;

          // Set the authenticated flag to true
          this._authenticated = true;
        }

        // Return a new observable with the response
        return of(response);
      })
    );
  }

  /**
   * Sign out
   */
  signOut(): Observable<boolean> {
    return this._httpClient.post<void>(`${this._appConfig.apiEndpoint}/auth/logout`, null).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
      finalize(() => {
        // Remove the access token from the local storage
        localStorage.removeItem(AUTH_TOKEN);

        // Set the authenticated flag to false
        this._authenticated = false;
      })
    );
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
