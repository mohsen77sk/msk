import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { ExpensesService } from './expenses.service';
import { ExpensesComponent } from './expenses.component';
import { ExpensesListComponent } from './list/list.component';
import { ExpensesCardComponent } from './card/card.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { catchError, throwError } from 'rxjs';

/**
 * Expense resolver
 *
 * @param route
 * @param state
 */
const expenseResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const expensesService = inject(ExpensesService);
  const router = inject(Router);

  return expensesService.getExpense(route.paramMap.get('id') ?? 0).pipe(
    // Error here means the requested expense is not available
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
    component: ExpensesComponent,
    providers: [
      provideTranslocoScope({
        scope: 'expenses',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    children: [
      {
        path: '',
        component: ExpensesListComponent,
        children: [
          {
            path: 'card/new',
            component: ExpensesCardComponent,
            resolve: {},
          },
          {
            path: 'card/view/:id',
            component: ExpensesCardComponent,
            resolve: { card: expenseResolver },
          },
        ],
      },
    ],
  },
];
