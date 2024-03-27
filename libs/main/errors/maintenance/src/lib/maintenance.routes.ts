import { Routes } from '@angular/router';
import { MaintenanceComponent } from './maintenance.component';

import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@ngneat/transloco';

export const routes: Routes = [
  {
    path: '',
    component: MaintenanceComponent,
    providers: [
      provideTranslocoScope({
        scope: 'maintenance',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
