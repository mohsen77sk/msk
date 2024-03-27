import { Route } from '@angular/router';
import { MainLayoutComponent } from '@msk/main/shell/ui/layout';

export const mainRoutes: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    data: {
      layoutType: 'empty',
    },
    children: [],
  },
  // Error routes & Catch all
  {
    path: '',
    component: MainLayoutComponent,
    data: {
      layoutType: 'empty',
    },
    children: [
      {
        path: 'not-found',
        pathMatch: 'full',
        loadChildren: () => import('@msk/main/errors/not-found').then((r) => r.routes),
      },
      { path: '**', redirectTo: 'not-found' },
    ],
  },
];
