import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { SalesService } from './sales.service';
import { SalesComponent } from './sales.component';
import { SalesListComponent } from './list/list.component';
import { SalesCardComponent } from './card/card.component';

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
  const salesService = inject(SalesService);
  const router = inject(Router);

  return salesService.getSaleInvoice(route.paramMap.get('id') ?? 0).pipe(
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
    }),
  );
};

export const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
    providers: [
      provideTranslocoScope({
        scope: 'sales',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    children: [
      {
        path: '',
        component: SalesListComponent,
        resolve: {
          invoices: () => inject(SalesService).getSaleInvoices(),
        },
        children: [
          {
            path: 'card/new',
            component: SalesCardComponent,
            resolve: {},
          },
          {
            path: 'card/view/:id',
            component: SalesCardComponent,
            resolve: { card: invoiceResolver },
          },
        ],
      },
    ],
  },
];
