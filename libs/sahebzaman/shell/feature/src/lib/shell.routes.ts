import { Route } from '@angular/router';
import { AuthGuard, NoAuthGuard } from '@msk/sahebzaman/shell/core/auth';
import { LayoutComponent } from '@msk/sahebzaman/shell/ui/layout';
import { initialDataResolver } from './shell.resolvers';

export const routes: Route[] = [
  // Redirect empty path to '/panel/dashboard'
  { path: '', pathMatch: 'full', redirectTo: 'panel/dashboard' },
  { path: 'panel', pathMatch: 'full', redirectTo: 'panel/dashboard' },

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
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layoutType: 'empty',
    },
    children: [
      {
        path: 'sign-in',
        loadChildren: () => import('@msk/sahebzaman/auth/sign-in').then((r) => r.routes),
      },
    ],
  },

  // Auth routes for authenticated users
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layoutType: 'empty',
    },
    children: [
      {
        path: 'sign-out',
        loadChildren: () => import('@msk/sahebzaman/auth/sign-out').then((r) => r.routes),
      },
    ],
  },

  // Admin routes
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initial: initialDataResolver,
    },
    children: [
      // Panel
      {
        path: 'panel',
        children: [
          {
            path: 'dashboard',
            loadChildren: () => import('@msk/sahebzaman/panel/dashboard').then((r) => r.routes),
          },
          {
            path: 'people',
            loadChildren: () => import('@msk/sahebzaman/panel/people').then((r) => r.routes),
          },
          {
            path: 'accounts',
            loadChildren: () => import('@msk/sahebzaman/panel/accounts').then((r) => r.routes),
          },
          {
            path: 'loans',
            loadChildren: () => import('@msk/sahebzaman/panel/loans').then((r) => r.routes),
          },
        ],
      },
    ],
  },

  // Error routes & Catch all
  {
    path: '',
    component: LayoutComponent,
    data: {
      layoutType: 'empty',
    },
    children: [
      {
        path: 'internal-server-error',
        loadChildren: () => import('@msk/shared/pages/errors/internal-server-error').then((r) => r.routes),
      },
      {
        path: 'maintenance',
        loadChildren: () => import('@msk/shared/pages/errors/maintenance').then((r) => r.routes),
      },
      {
        path: 'not-found',
        loadChildren: () => import('@msk/shared/pages/errors/not-found').then((r) => r.routes),
      },
      { path: '**', redirectTo: 'not-found' },
    ],
  },
];
