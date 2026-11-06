import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { QuickNotesService } from './quick-notes.service';
import { QuickNotesComponent } from './quick-notes.component';
import { QuickNotesListComponent } from './list/list.component';
import { QuickNotesCardComponent } from './card/card.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MskErrorResponse } from '@msk/shared/data-access';
import { catchError, throwError } from 'rxjs';

/**
 * Quick note resolver
 *
 * @param route
 * @param state
 */
const quickNoteResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const quickNotesService = inject(QuickNotesService);
  const router = inject(Router);

  return quickNotesService.getQuickNote(route.paramMap.get('id') ?? 0).pipe(
    // Error here means the requested quick note is not available
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
    component: QuickNotesComponent,
    providers: [
      provideTranslocoScope({
        scope: 'quickNotes',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    children: [
      {
        path: '',
        component: QuickNotesListComponent,
        children: [
          {
            path: 'card/new',
            component: QuickNotesCardComponent,
            resolve: {},
          },
          {
            path: 'card/view/:id',
            component: QuickNotesCardComponent,
            resolve: { card: quickNoteResolver },
          },
        ],
      },
    ],
  },
];
