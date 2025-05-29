import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { CustomersService } from './customers.service';
import { CustomersComponent } from './customers.component';
import { CustomersListComponent } from './list/list.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';
import { CustomersCardComponent } from './card/card.component';
import { MskErrorResponse } from '@msk/shared/data-access';
import { catchError, throwError } from 'rxjs';

/**
 * Customer resolver
 *
 * @param route
 * @param state
 */
const customerResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const customersService = inject(CustomersService);
  const router = inject(Router);

  return customersService.getCustomer(route.paramMap.get('id') ?? 0).pipe(
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
    component: CustomersComponent,
    providers: [
      provideTranslocoScope({
        scope: 'customers',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    children: [
      {
        path: '',
        component: CustomersListComponent,
        resolve: {
          customers: () => inject(CustomersService).getCustomers(),
        },
        children: [
          {
            path: 'card/new',
            component: CustomersCardComponent,
            resolve: {},
          },
          {
            path: 'card/view/:id',
            component: CustomersCardComponent,
            resolve: { card: customerResolver },
          },
        ],
      },
    ],
  },
];
