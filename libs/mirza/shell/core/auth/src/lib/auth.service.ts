import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { Observable, catchError, finalize, map, of, shareReplay, switchMap, throwError } from 'rxjs';
import {
  AUTH_TOKEN,
  LoginRequest,
  LoginResponse,
  REFRESH_TOKEN,
  RegistrationRequest,
  ResetPasswordRequest,
  TokenPair,
} from './auth.types';
import { AuthUtils } from './auth.utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated = false;
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);
  private _refreshing$: Observable<boolean> | null = null;

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

  /**
   * Setter & getter for refresh token
   */
  set refreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  get refreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN) ?? '';
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Send otp for registration
   *
   * @param phone
   */
  registrationOtp(phone: string): Observable<boolean> {
    return this._httpClient
      .post<{ success: boolean }>(`${this._appConfig.apiEndpoint}/auth/register/request-otp`, {
        phone,
      })
      .pipe(switchMap((response) => of(response.success)));
  }

  /**
   * Registration
   *
   * @param credentials
   */
  registrationVerify(credentials: RegistrationRequest): Observable<LoginResponse> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError(() => 'User is already logged in.');
    }

    return this._httpClient
      .post<LoginResponse>(`${this._appConfig.apiEndpoint}/auth/register/verify`, credentials)
      .pipe(
        switchMap((response) => {
          // Store the access token in the local storage
          this.accessToken = response.accessToken;
          this.refreshToken = response.refreshToken;

          // Set the authenticated flag to true
          this._authenticated = true;

          // Return a new observable with the response
          return of(response);
        }),
      );
  }

  /**
   * Send otp for reset password
   *
   * @param phone
   */
  resetPasswordOtp(phone: string): Observable<boolean> {
    return this._httpClient
      .post<{ success: boolean }>(`${this._appConfig.apiEndpoint}/auth/forgot-password/request-otp`, {
        phone,
      })
      .pipe(switchMap((response) => of(response.success)));
  }

  /**
   * Reset password
   *
   * @param credentials
   */
  resetPasswordVerify(credentials: ResetPasswordRequest): Observable<boolean> {
    return this._httpClient
      .post<{ success: boolean }>(`${this._appConfig.apiEndpoint}/auth/forgot-password/reset`, credentials)
      .pipe(switchMap((response) => of(response.success)));
  }

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
        // Store the access token in the local storage
        this.accessToken = response.accessToken;
        this.refreshToken = response.refreshToken;

        // Set the authenticated flag to true
        this._authenticated = true;

        // Return a new observable with the response
        return of(response);
      }),
    );
  }

  /**
   * Sign out
   */
  signOut(): void {
    // Remove the access token from the local storage
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);

    // Set the authenticated flag to false
    this._authenticated = false;
  }

  /**
   * Whether the access token must be renewed before use: expired or about to expire, or issued
   * before token types existed (those last a year; they are swapped for the short ones)
   */
  needsRefresh(): boolean {
    const token = this.accessToken;
    if (!token) return !!this.refreshToken;
    return AuthUtils.isTokenExpired(token, 60) || AuthUtils.tokenType(token) === null;
  }

  /**
   * Renew the tokens with the refresh token (or, once, a token issued before token types).
   * Concurrent callers share one request. Emits false when the session cannot be renewed.
   */
  refreshTokens(): Observable<boolean> {
    if (this._refreshing$) return this._refreshing$;

    const candidates = [this.refreshToken, this.accessToken].filter(
      (t) => !!t && !AuthUtils.isTokenExpired(t) && AuthUtils.tokenType(t) !== 'access',
    );
    if (!candidates.length) return of(false);

    this._refreshing$ = this._httpClient
      .post<TokenPair>(`${this._appConfig.apiEndpoint}/auth/refresh`, { refreshToken: candidates[0] })
      .pipe(
        map((pair) => {
          this.accessToken = pair.accessToken;
          this.refreshToken = pair.refreshToken;
          this._authenticated = true;
          return true;
        }),
        catchError(() => of(false)),
        finalize(() => (this._refreshing$ = null)),
        shareReplay(1),
      );
    return this._refreshing$;
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // A token that is expired, close to expiry or from before token types: renew it silently
    if (this.needsRefresh()) {
      return this.refreshTokens();
    }

    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }

    return of(!!this.accessToken && !AuthUtils.isTokenExpired(this.accessToken));
  }
}
