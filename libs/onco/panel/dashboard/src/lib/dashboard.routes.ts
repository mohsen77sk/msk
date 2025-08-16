import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    providers: [
      provideTranslocoScope({
        scope: 'dashboard',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
