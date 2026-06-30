import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { StoreService } from '@msk/mirza/shell/core/store';

type GuardResult = boolean | UrlTree;

const resolveStoreAccess = (
  storeService: StoreService,
  whenHasStore: GuardResult,
  whenNoStore: GuardResult,
): Observable<GuardResult> => {
  if (storeService.storesLoaded) {
    return of(storeService.hasStores ? whenHasStore : whenNoStore);
  }

  return storeService.getAll().pipe(
    map((stores) => (stores.some((store) => store.isActive) ? whenHasStore : whenNoStore)),
    catchError(() => of(whenNoStore)),
  );
};

export const StoreRequiredGuard: CanActivateFn | CanActivateChildFn = () => {
  const router = inject(Router);
  const storeService = inject(StoreService);

  return resolveStoreAccess(storeService, true, router.parseUrl('/onboarding/store'));
};

export const OnboardingStoreGuard: CanActivateFn | CanActivateChildFn = () => {
  const router = inject(Router);
  const storeService = inject(StoreService);

  return resolveStoreAccess(storeService, router.parseUrl('/panel/dashboard'), true);
};

export const StoreProfileOnboardingGuard: CanActivateFn | CanActivateChildFn = () => {
  const router = inject(Router);
  const storeService = inject(StoreService);

  return resolveStoreAccess(storeService, true, router.parseUrl('/onboarding/store'));
};
