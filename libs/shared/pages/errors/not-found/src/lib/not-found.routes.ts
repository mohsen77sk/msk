import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: NotFoundComponent,
    providers: [
      provideTranslocoScope({
        scope: 'notFound',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
