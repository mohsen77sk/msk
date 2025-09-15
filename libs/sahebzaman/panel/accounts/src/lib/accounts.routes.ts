import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { AccountService } from './accounts.service';
import { AccountsComponent } from './accounts.component';
import { AccountsListComponent } from './list/list.component';
import { AccountsCardComponent } from './card/card.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { provideTranslocoScope } from '@jsverse/transloco';
import { catchError, throwError } from 'rxjs';

/**
 * Account resolver
 *
 * @param route
 * @param state
 */
const accountResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  return accountService.getAccountWithBalance(route.paramMap.get('id') ?? 0).pipe(
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
    component: AccountsComponent,
    providers: [
      provideTranslocoScope({
        scope: 'accounts',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    children: [
      {
        path: '',
        component: AccountsListComponent,
        children: [
          {
            path: 'card/new',
            component: AccountsCardComponent,
            resolve: {},
          },
          {
            path: 'card/view/:id',
            component: AccountsCardComponent,
            resolve: { card: accountResolver },
          },
        ],
      },
    ],
  },
];
