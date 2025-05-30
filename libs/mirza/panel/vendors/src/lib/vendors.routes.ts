import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { VendorsService } from './vendors.service';
import { VendorsComponent } from './vendors.component';
import { VendorsListComponent } from './list/list.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { catchError, throwError } from 'rxjs';
import { VendorsCardComponent } from './card/card.component';

/**
 * Vendor resolver
 *
 * @param route
 * @param state
 */
const vendorResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const vendorsService = inject(VendorsService);
  const router = inject(Router);

  return vendorsService.getVendor(route.paramMap.get('id') ?? 0).pipe(
    // Error here means the requested contact is not available
    catchError((error: MskErrorResponse) => {
      // Log the error
      console.error(error);
      // Get the parent url
      const parentUrl = state.url.split('/').slice(0, -1).join('/');
      // Navigate to there
      router.navigateByUrl(parentUrl);
      // Throw an error
      return throwError(() => new Error(error.message));
    })
  );
};

export const routes: Routes = [
  {
    path: '',
    component: VendorsComponent,
    providers: [
      provideTranslocoScope({
        scope: 'vendors',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    children: [
      {
        path: '',
        component: VendorsListComponent,
        resolve: {
          vendors: () => inject(VendorsService).getVendors(),
        },
        children: [
          {
            path: 'card/new',
            component: VendorsCardComponent,
            resolve: {},
          },
          {
            path: 'card/view/:id',
            component: VendorsCardComponent,
            resolve: { card: vendorResolver },
          },
        ],
      },
    ],
  },
];
