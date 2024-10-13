import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AccountService } from './accounts.service';
import { AccountsComponent } from './accounts.component';
import { AccountsListComponent } from './list/list.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { provideTranslocoScope } from '@jsverse/transloco';
import { catchError, throwError } from 'rxjs';

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
        resolve: {
          persons: () => inject(AccountService).getAccounts(),
        },
      },
    ],
  },
];
