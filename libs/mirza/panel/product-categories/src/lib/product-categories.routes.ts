import { Routes } from '@angular/router';
import { ProductCategoriesComponent } from './product-categories.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: ProductCategoriesComponent,
    providers: [
      provideTranslocoScope({
        scope: 'categories',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
