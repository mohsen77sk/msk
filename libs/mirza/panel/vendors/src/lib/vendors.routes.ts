import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { VendorsService } from './vendors.service';
import { VendorsComponent } from './vendors.component';
import { VendorsListComponent } from './list/list.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: VendorsComponent,
    providers: [
      provideTranslocoScope({
        scope: 'vendors',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    children: [
      {
        path: '',
        component: VendorsListComponent,
        resolve: {
          vendors: () => inject(VendorsService).getVendors(),
        },
        children: [],
      },
    ],
  },
];
