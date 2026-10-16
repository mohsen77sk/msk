import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    providers: [
      provideTranslocoScope({
        scope: 'settings',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
