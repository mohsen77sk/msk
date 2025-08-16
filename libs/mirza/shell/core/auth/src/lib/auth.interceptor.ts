import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { StoreService } from '@msk/mirza/shell/core/store';
import { AuthService } from './auth.service';
import { AuthUtils } from './auth.utils';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const storeService = inject(StoreService);

  // Clone the request headers object to add new headers
  let headers = req.headers;

  // If the access token didn't expire, add the Authorization header.
  if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
    headers = headers.append('Authorization', 'Bearer ' + authService.accessToken);
  }

  // If the store is set, add the Store-Id header.
  if (storeService.currentStore) {
    headers = headers.append('Store-Id', storeService.currentStore.id.toString());
  }

  // Clone the request object by new headers
  const newReq = req.clone({ headers });

  // Response
  return next(newReq).pipe(
    catchError((error) => {
      // Catch "401 Unauthorized" responses
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Sign out
        authService.signOut();

        // Reload the app
        location.reload();
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
