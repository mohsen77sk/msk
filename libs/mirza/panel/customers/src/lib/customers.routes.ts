import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CustomersService } from './customers.service';
import { CustomersComponent } from './customers.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    resolve: {
      customers: () => inject(CustomersService).getCustomers(),
    },
    providers: [
      provideTranslocoScope({
        scope: 'customers',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
