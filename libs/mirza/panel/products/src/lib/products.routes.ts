import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProductsService } from './products.service';
import { ProductsComponent } from './products.component';
import { ProductsListComponent } from './list/list.component';

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
    children: [
      {
        path: '',
        component: ProductsListComponent,
        resolve: {
          productCategories: () => inject(ProductsService).getProducts(),
        },
        children: [],
      },
    ],
  },
];
