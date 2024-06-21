import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { PeopleService } from './people.service';
import { PeopleComponent } from './people.component';
import { PeopleListComponent } from './list/list.component';

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
    children: [
      {
        path: '',
        component: PeopleListComponent,
        resolve: {
          persons: () => inject(PeopleService).getPersons(),
        },
      },
    ],
  },
];
