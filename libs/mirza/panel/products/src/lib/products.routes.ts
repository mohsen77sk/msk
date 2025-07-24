import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { ProductsService } from './products.service';
import { ProductsComponent } from './products.component';
import { ProductCardComponent } from './card/card.component';
import { ProductsListComponent } from './list/list.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { catchError, throwError } from 'rxjs';

/**
 * Product resolver
 *
 * @param route
 * @param state
 */
const productResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const productsService = inject(ProductsService);
  const router = inject(Router);

  return productsService.getProduct(route.paramMap.get('id') ?? 0).pipe(
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
    })
  );
};

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
          products: () => inject(ProductsService).getProducts(),
        },
        children: [
          {
            path: 'card/new',
            component: ProductCardComponent,
            resolve: {},
          },
          {
            path: 'card/view/:id',
            component: ProductCardComponent,
            resolve: { card: productResolver },
          },
        ],
      },
    ],
  },
];
