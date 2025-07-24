import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { PurchasesService } from './purchases.service';
import { PurchasesComponent } from './purchases.component';
import { PurchasesListComponent } from './list/list.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { catchError, throwError } from 'rxjs';

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
      },
    ],
  },
];
