import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, EMPTY } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from '@msk/mirza/shell/core/user';
import { StoreAccessService, StoreService } from '@msk/mirza/shell/core/store';
import { NavigationService } from '@msk/mirza/shell/core/navigation';

export const initialDataResolver = () => {
  const router = inject(Router);
  const userService = inject(UserService);
  const storeService = inject(StoreService);
  const navigationService = inject(NavigationService);
  const storeAccessService = inject(StoreAccessService);

  // Fork join multiple API endpoint calls to wait all of them to finish
  return forkJoin([userService.get(), storeService.getAll(), navigationService.get()]).pipe(
    switchMap(([user, stores, navigation]) => {
      // if store list is empty, redirect to onboarding
      if (!stores || stores.length === 0) {
        router.navigate(['onboarding']);
        return EMPTY;
      }
      // The caller's permissions in the current store (getAll set it)
      return storeAccessService.load().pipe(map(() => [user, stores, navigation]));
    }),
  );
};
