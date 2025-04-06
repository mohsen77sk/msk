import { Routes } from '@angular/router';
import { InternalServerErrorComponent } from './internal-server-error.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: InternalServerErrorComponent,
    providers: [
      provideTranslocoScope({
        scope: 'internalServerError',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
