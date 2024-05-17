import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@ngneat/transloco';

export const routes: Routes = [
  {
    path: '',
    component: SignInComponent,
    providers: [
      provideTranslocoScope({
        scope: 'signIn',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
