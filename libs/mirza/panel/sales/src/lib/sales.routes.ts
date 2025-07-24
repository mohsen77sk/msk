import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { SalesService } from './sales.service';
import { SalesComponent } from './sales.component';
import { SalesListComponent } from './list/list.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { catchError, throwError } from 'rxjs';

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
          productCategories: () => inject(SalesService).getSaleInvoices(),
        },
      },
    ],
  },
];
