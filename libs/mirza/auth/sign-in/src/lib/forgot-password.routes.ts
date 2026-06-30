import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';
import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordComponent,
    providers: [
      provideTranslocoScope({
        scope: 'signIn',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
