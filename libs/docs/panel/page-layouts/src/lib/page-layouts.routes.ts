import { Routes } from '@angular/router';
import { DocsPageLayoutsOverviewComponent } from './overview/overview.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview',
  },
  {
    path: 'overview',
    loadComponent: () => DocsPageLayoutsOverviewComponent,
  },
];
