import { Routes } from '@angular/router';
import { VendorsComponent } from './vendors.component';

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
    children: [],
  },
];
