import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { PurchasesService } from './purchases.service';
import { PurchasesComponent } from './purchases.component';
import { PurchasesListComponent } from './list/list.component';
import { PurchasesCardComponent } from './card/card.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { catchError, throwError } from 'rxjs';

/**
 * Invoice resolver
 *
 * @param route
 * @param state
 */
const invoiceResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const purchasesService = inject(PurchasesService);
  const router = inject(Router);

  return purchasesService.getPurchaseInvoice(route.paramMap.get('id') ?? 0).pipe(
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
    component: PurchasesComponent,
    providers: [
      provideTranslocoScope({
        scope: 'purchases',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    children: [
      {
        path: '',
        component: PurchasesListComponent,
        resolve: {
          productCategories: () => inject(PurchasesService).getPurchaseInvoices(),
        },
        children: [
          {
            path: 'card/new',
            component: PurchasesCardComponent,
            resolve: {},
          },
          {
            path: 'card/view/:id',
            component: PurchasesCardComponent,
            resolve: { card: invoiceResolver },
          },
        ],
      },
    ],
  },
];
