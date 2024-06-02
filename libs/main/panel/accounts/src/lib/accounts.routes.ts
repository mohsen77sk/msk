import { Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { AccountsListComponent } from './list/list.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    providers: [
      provideTranslocoScope({
        scope: 'accounts',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    children: [
      {
        path: '',
        component: AccountsListComponent,
      },
    ],
  },
];
