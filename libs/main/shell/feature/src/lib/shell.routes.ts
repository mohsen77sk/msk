import { Route } from '@angular/router';
import { MainLayoutComponent } from '@msk/main/shell/ui/layout';
import { initialMainDataResolver } from './shell.resolvers';

export const mainRoutes: Route[] = [
  // Redirect empty path to '/panel/dashboard'
  { path: '', pathMatch: 'full', redirectTo: 'panel/dashboard' },

  // Redirect signed in user to the '/panel/dashboard'
  //
  // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
  // path. eBelow is another redirection for that path to redirect the user to the desird
  // location. This is a small convenience to keep all main routes together here on this file.
  {
    path: 'signed-in-redirect',
    pathMatch: 'full',
    redirectTo: 'panel/dashboard',
  },

  // Auth routes for guests
  {
    path: '',
    component: MainLayoutComponent,
    data: {
      layoutType: 'empty',
    },
    children: [
      {
        path: 'sign-in',
        loadChildren: () => import('@msk/main/auth/sign-in').then((r) => r.routes),
      },
    ],
  },

  // Auth routes for authenticated users
  {
    path: '',
    component: MainLayoutComponent,
    data: {
      layoutType: 'empty',
    },
    children: [
      {
        path: 'sign-out',
        loadChildren: () => import('@msk/main/auth/sign-out').then((r) => r.routes),
      },
    ],
  },

  // Admin routes
  {
    path: '',
    component: MainLayoutComponent,
    resolve: {
      initial: initialMainDataResolver,
    },
    children: [
      // Panel
      {
        path: 'panel',
        children: [
          {
            path: 'dashboard',
            pathMatch: 'full',
            loadChildren: () => import('@msk/main/panel/dashboard').then((r) => r.routes),
          },
          {
            path: 'people',
            pathMatch: 'full',
            loadChildren: () => import('@msk/main/panel/people').then((r) => r.routes),
          },
          {
            path: 'accounts',
            pathMatch: 'full',
            loadChildren: () => import('@msk/main/panel/accounts').then((r) => r.routes),
          },
          {
            path: 'loans',
            pathMatch: 'full',
            loadChildren: () => import('@msk/main/panel/loans').then((r) => r.routes),
          },
        ],
      },
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
