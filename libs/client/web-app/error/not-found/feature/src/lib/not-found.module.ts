import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { scopeLoader } from 'scoped-translations';

import { NotFoundComponent } from './not-found.component';

const routes: Routes = [
  {
    path: '',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'error',
        loader: scopeLoader(
          (lang: string, root: string) => import(`./${root}/${lang}.json`)
        ),
      },
    },
  ],
  declarations: [NotFoundComponent],
})
export class NotFoundModule {}
