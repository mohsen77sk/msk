import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { PaymentTypesService } from './payment-types.service';
import { PaymentTypesComponent } from './payment-types.component';
import { PaymentTypesListComponent } from './list/list.component';
import { PaymentTypesCardComponent } from './card/card.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { catchError, throwError } from 'rxjs';

/**
 * Payment type resolver
 *
 * @param route
 * @param state
 */
const paymentTypeResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const paymentTypeService = inject(PaymentTypesService);
  const router = inject(Router);

  return paymentTypeService.getPaymentType(route.paramMap.get('id') ?? 0).pipe(
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
    component: PaymentTypesComponent,
    providers: [
      provideTranslocoScope({
        scope: 'paymentTypes',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    children: [
      {
        path: '',
        component: PaymentTypesListComponent,
        children: [
          {
            path: 'card/new',
            component: PaymentTypesCardComponent,
            resolve: {},
          },
          {
            path: 'card/view/:id',
            component: PaymentTypesCardComponent,
            resolve: { card: paymentTypeResolver },
          },
        ],
      },
    ],
  },
];
