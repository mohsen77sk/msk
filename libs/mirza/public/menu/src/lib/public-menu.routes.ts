import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { scopeLoader } from '@msk/shared/utils/transloco';
import { PublicMenuComponent } from './public-menu.component';

export const routes: Routes = [
  {
    path: ':slug',
    component: PublicMenuComponent,
    providers: [
      provideTranslocoScope({
        scope: 'public-menu',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
