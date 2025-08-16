import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { PeopleService } from './people.service';
import { PeopleComponent } from './people.component';
import { PeopleListComponent } from './list/list.component';
import { PeopleCardComponent } from './card/card.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { provideTranslocoScope } from '@jsverse/transloco';
import { catchError, throwError } from 'rxjs';

/**
 * Person resolver
 *
 * @param route
 * @param state
 */
const personResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const peopleService = inject(PeopleService);
  const router = inject(Router);

  return peopleService.getPerson(route.paramMap.get('id') ?? 0).pipe(
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
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  {
    path: '',
    component: PeopleComponent,
    providers: [
      provideTranslocoScope({
        scope: 'people',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    children: [
      {
        path: '',
        component: PeopleListComponent,
        resolve: {
          persons: () => inject(PeopleService).getPersons(),
        },
        children: [
          {
            path: 'card/new',
            component: PeopleCardComponent,
            resolve: {},
          },
          {
            path: 'card/view/:id',
            component: PeopleCardComponent,
            resolve: { card: personResolver },
          },
        ],
      },
    ],
  },
];
