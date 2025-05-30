import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    providers: [
      provideTranslocoScope({
        scope: 'products',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
