import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { LoanService } from './loans.service';
import { LoansComponent } from './loans.component';
import { LoansListComponent } from './list/list.component';
import { LoansCardComponent } from './card/card.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { provideTranslocoScope } from '@jsverse/transloco';
import { catchError, throwError } from 'rxjs';

/**
 * Loan resolver
 *
 * @param route
 * @param state
 */
const loanResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const loanService = inject(LoanService);
  const router = inject(Router);

  return loanService.getLoan(route.paramMap.get('id') ?? 0).pipe(
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
    component: LoansComponent,
    providers: [
      provideTranslocoScope({
        scope: 'loans',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    children: [
      {
        path: '',
        component: LoansListComponent,
        children: [
          {
            path: 'card/new',
            component: LoansCardComponent,
            resolve: {},
          },
          {
            path: 'card/view/:id',
            component: LoansCardComponent,
            resolve: { card: loanResolver },
          },
        ],
      },
    ],
  },
];
