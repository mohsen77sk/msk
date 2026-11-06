import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY, of, switchMap, take } from 'rxjs';
import { StoreAccess } from './store-access.types';
import { StoreAccessService } from './store-access.service';

/**
 * Opens a page only when the caller has the permission PAGE_PERMISSIONS gives its link;
 * otherwise sends them to the page they land on.
 *
 * A resolver, not a guard: resolvers run after the parent's initialDataResolver, which loads the
 * access of the current store (guards would run before it).
 *
 * @param link the page link as in PAGE_PERMISSIONS, e.g. '/panel/products'
 */
export const storePageResolver =
  (link: string): ResolveFn<StoreAccess> =>
  () => {
    const router = inject(Router);
    const storeAccessService = inject(StoreAccessService);

    return storeAccessService.access$.pipe(
      take(1),
      switchMap((access) => {
        if (storeAccessService.canOpen(link)) return of(access);
        // Completing without a value cancels this navigation
        router.navigateByUrl(storeAccessService.homeUrl());
        return EMPTY;
      }),
    );
  };
