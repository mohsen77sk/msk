import { Route } from '@angular/router';
import { AuthGuard, NoAuthGuard } from '@msk/main/shell/core/auth';
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
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
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
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
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
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
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
      // Documentation
      {
        path: 'docs',
        children: [
          // Ui
          {
            path: 'ui/alert',
            pathMatch: 'full',
            loadComponent: () => import('@msk/shared/ui/alert').then((r) => r.MskDocsAlertComponent),
          },
          {
            path: 'ui/fullscreen',
            pathMatch: 'full',
            loadComponent: () => import('@msk/shared/ui/fullscreen').then((r) => r.MskDocsFullscreenComponent),
          },
          {
            path: 'ui/highlight',
            pathMatch: 'full',
            loadComponent: () => import('@msk/shared/ui/highlight').then((r) => r.MskDocsHighlightComponent),
          },
          {
            path: 'ui/loading-bar',
            pathMatch: 'full',
            loadComponent: () => import('@msk/shared/ui/loading-bar').then((r) => r.MskDocsLoadingBarComponent),
          },
          // Pages
          {
            path: 'pages/not-found',
            pathMatch: 'full',
            loadChildren: () => import('@msk/main/errors/not-found').then((r) => r.routes),
          },
          {
            path: 'pages/internal-server-error',
            pathMatch: 'full',
            loadChildren: () => import('@msk/main/errors/internal-server-error').then((r) => r.routes),
          },
          {
            path: 'pages/maintenance',
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
