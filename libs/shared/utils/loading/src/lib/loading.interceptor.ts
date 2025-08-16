import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { MskLoadingBarService } from '@msk/shared/ui/loading-bar';
import { finalize, Observable, take } from 'rxjs';

export const mskLoadingInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const mskLoadingBarService = inject(MskLoadingBarService);
  let handleRequestsAutomatically = false;

  mskLoadingBarService.auto$.pipe(take(1)).subscribe((value) => {
    handleRequestsAutomatically = value;
  });

  // If the Auto mode is turned off, do nothing
  if (!handleRequestsAutomatically) {
    return next(req);
  }

  // Set the loading status to true
  mskLoadingBarService.setLoadingStatus(true, req.url);

  return next(req).pipe(
    finalize(() => {
      // Set the status to false if there are any errors or the request is completed
      mskLoadingBarService.setLoadingStatus(false, req.url);
    }),
  );
};
