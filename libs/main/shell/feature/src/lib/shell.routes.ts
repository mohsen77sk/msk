import { Route } from '@angular/router';
import { MainLayoutComponent } from '@msk/main/shell/ui/layout';
import { initialMainDataResolver } from './shell.resolvers';

export const mainRoutes: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    resolve: {
      initial: initialMainDataResolver,
    },
    children: [
      // Pages
      {
        path: 'pages',
        children: [
          // Error
          {
            path: 'error/not-found',
            pathMatch: 'full',
            loadChildren: () => import('@msk/main/errors/not-found').then((r) => r.routes),
          },
          {
            path: 'error/internal-server-error',
            pathMatch: 'full',
            loadChildren: () => import('@msk/main/errors/internal-server-error').then((r) => r.routes),
          },
          // Maintenance
          {
            path: 'maintenance',
            pathMatch: 'full',
            loadChildren: () => import('@msk/main/errors/maintenance').then((r) => r.routes),
          },
        ],
      },
    ],
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
        path: 'internal-server-error',
        pathMatch: 'full',
        loadChildren: () => import('@msk/main/errors/internal-server-error').then((r) => r.routes),
      },
      {
        path: 'maintenance',
        pathMatch: 'full',
        loadChildren: () => import('@msk/main/errors/maintenance').then((r) => r.routes),
      },
      {
        path: 'not-found',
        pathMatch: 'full',
        loadChildren: () => import('@msk/main/errors/not-found').then((r) => r.routes),
      },
      { path: '**', redirectTo: 'not-found' },
    ],
  },
];
