import { Routes } from '@angular/router';
import { LoansComponent } from './loans.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: LoansComponent,
    providers: [
      provideTranslocoScope({
        scope: 'loans',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
