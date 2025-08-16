import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesComponent } from './product-categories.component';
import { ProductCategoriesListComponent } from './list/list.component';
import { ProductCategoriesCardComponent } from './card/card.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { catchError, throwError } from 'rxjs';

/**
 * Product category resolver
 *
 * @param route
 * @param state
 */
const productCategoryResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const productCategoriesService = inject(ProductCategoriesService);
  const router = inject(Router);

  return productCategoriesService.getProductCategory(route.paramMap.get('id') ?? 0).pipe(
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
    }),
  );
};

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
    children: [
      {
        path: '',
        component: ProductCategoriesListComponent,
        resolve: {
          productCategories: () => inject(ProductCategoriesService).getProductCategories(),
        },
        children: [
          {
            path: 'card/new',
            component: ProductCategoriesCardComponent,
            resolve: {},
          },
          {
            path: 'card/view/:id',
            component: ProductCategoriesCardComponent,
            resolve: { card: productCategoryResolver },
          },
        ],
      },
    ],
  },
];
