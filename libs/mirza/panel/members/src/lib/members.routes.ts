import { Routes } from '@angular/router';
import { scopeLoader } from '@msk/shared/utils/transloco';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MembersComponent } from './members.component';

export const routes: Routes = [
  {
    path: '',
    component: MembersComponent,
    providers: [
      provideTranslocoScope({
        scope: 'members',
        loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
      }),
    ],
  },
];
