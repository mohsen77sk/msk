import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { LoadingBarService } from './loading-bar.service';
import { finalize, Observable, take } from 'rxjs';

export const loadingBarInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loadingService = inject(LoadingBarService);
  let handleRequestsAutomatically = false;

  loadingService.auto$.pipe(take(1)).subscribe((value) => {
    handleRequestsAutomatically = value;
  });

  // If the Auto mode is turned off, do nothing
  if (!handleRequestsAutomatically) {
    return next(req);
  }

  // Set the loading status to true
  loadingService.setLoadingStatus(true, req.url);

  return next(req).pipe(
    finalize(() => {
      // Set the status to false if there are any errors or the request is completed
      loadingService.setLoadingStatus(false, req.url);
    })
  );
};
