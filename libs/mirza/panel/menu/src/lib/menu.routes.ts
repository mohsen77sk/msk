import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { scopeLoader } from '@msk/shared/utils/transloco';
import { MenuComponent } from './menu.component';

export const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    providers: [
      provideTranslocoScope({
        scope: 'menu',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
