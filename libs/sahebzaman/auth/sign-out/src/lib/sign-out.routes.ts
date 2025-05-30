import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { SignOutComponent } from './sign-out.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';
import { AuthService } from '@msk/sahebzaman/shell/core/auth';

export const routes: Routes = [
  {
    path: '',
    component: SignOutComponent,
    providers: [
      provideTranslocoScope({
        scope: 'signOut',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
    resolve: {
      signOut: () => inject(AuthService).signOut(),
    },
  },
];
