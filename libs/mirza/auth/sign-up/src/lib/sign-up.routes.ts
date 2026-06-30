import { Routes } from '@angular/router';
import { SignUpComponent } from './sign-up.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: SignUpComponent,
    providers: [
      provideTranslocoScope({
        scope: 'signUp',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
