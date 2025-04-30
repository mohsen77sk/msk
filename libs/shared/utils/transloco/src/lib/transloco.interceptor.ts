import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const translocoInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const translocoService = inject(TranslocoService);

  // Clone the request object
  let newReq = req.clone();

  // Add the new header to the cloned request
  newReq = req.clone({
    headers: req.headers.set('Accept-Language', translocoService.getActiveLang()),
  });

  // Send request
  return next(newReq);
};
