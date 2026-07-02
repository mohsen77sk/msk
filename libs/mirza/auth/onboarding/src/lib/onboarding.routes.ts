import { Routes } from '@angular/router';
import { OnboardingComponent } from './onboarding.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: OnboardingComponent,
    providers: [
      provideTranslocoScope({
        scope: 'onboarding',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
