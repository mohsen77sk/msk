import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { StoreService } from '@msk/mirza/shell/core/store';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { AuthService } from './auth.service';
import { AuthUtils } from './auth.utils';

// Requests that must never trigger a token refresh (they create or renew the tokens)
const NO_REFRESH = /\/auth\/(login|refresh|register|forgot-password)/;

/**
 * Intercept
 *
 * Access tokens are short-lived. Before a request, an expired (or nearly expired) access token is
 * renewed with the refresh token; a 401 is retried once after a refresh. Only when the session
 * cannot be renewed is the user signed out.
 *
 * @param req
 * @param next
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  // Public (unauthenticated) API: never attach credentials or store context,
  // and never sign out / reload on its errors.
  if (req.url.startsWith(`${inject(MSK_APP_CONFIG).apiEndpoint}/public/`)) {
    return next(req);
  }

  const router = inject(Router);
  const authService = inject(AuthService);
  const storeService = inject(StoreService);
  const canRefresh = !NO_REFRESH.test(req.url);

  const send = (): Observable<HttpEvent<unknown>> => {
    // Clone the request headers object to add new headers
    let headers = req.headers;

    // If the access token didn't expire, add the Authorization header.
    if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
      headers = headers.set('Authorization', 'Bearer ' + authService.accessToken);
    }

    // If the store is set, add the Store-Id header.
    if (storeService.currentStore) {
      headers = headers.set('Store-Id', storeService.currentStore.id.toString());
    }

    return next(req.clone({ headers }));
  };

  const signOut = () => {
    authService.signOut();
    location.reload();
  };

  const first$ = canRefresh && authService.needsRefresh() ? authService.refreshTokens().pipe(switchMap(send)) : send();

  return first$.pipe(
    catchError((error) => {
      // "401 Unauthorized": renew the tokens once and retry; sign out only if that fails
      if (error instanceof HttpErrorResponse && error.status === 401 && canRefresh) {
        return authService.refreshTokens().pipe(
          switchMap((ok) => {
            if (!ok) {
              signOut();
              return throwError(() => error);
            }
            return send().pipe(
              catchError((retryError) => {
                if (retryError instanceof HttpErrorResponse && retryError.status === 401) signOut();
                return throwError(() => retryError);
              }),
            );
          }),
        );
      }

      // Catch "503 Service Unavailable" responses
      if (error instanceof HttpErrorResponse && error.status === 503) {
        // Navigate to maintenance
        router.navigate(['/maintenance']);
      }

      return throwError(() => error);
    }),
  );
};
