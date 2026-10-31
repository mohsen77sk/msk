import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { scopeLoader } from '@msk/shared/utils/transloco';
import { PosComponent } from './pos.component';

export const routes: Routes = [
  {
    path: '',
    component: PosComponent,
    providers: [
      provideTranslocoScope({
        scope: 'pos',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
