import { Routes } from '@angular/router';
import { PeopleComponent } from './people.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: PeopleComponent,
    providers: [
      provideTranslocoScope({
        scope: 'people',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
