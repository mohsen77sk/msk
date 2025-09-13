import { Route } from '@angular/router';
import { DocsLayoutComponent } from '@msk/docs/shell/ui/layout';
import { initialDocsDataResolver } from './shell.resolvers';

export const docsRoutes: Route[] = [
  // Redirect empty path to '/docs/animations'
  { path: '', pathMatch: 'full', redirectTo: 'docs/animations' },
  { path: 'docs', pathMatch: 'full', redirectTo: 'docs/animations' },

  // Admin routes
  {
    path: '',
    component: DocsLayoutComponent,
    resolve: {
      initial: initialDocsDataResolver,
    },
    children: [
      // Documentation
      {
        path: 'docs',
        children: [
          // Animation
          {
            path: 'animations',
            loadComponent: () => import('@msk/docs/panel/animations').then((r) => r.DocsAnimationsComponent),
          },
          {
            path: 'colors',
            loadComponent: () => import('@msk/docs/panel/colors').then((r) => r.DocsColorsComponent),
          },
          {
            path: 'typography',
            loadComponent: () => import('@msk/docs/panel/typography').then((r) => r.DocsTypographyComponent),
          },
          // Ui
          {
            path: 'components/alert',
            loadComponent: () => import('@msk/docs/panel/components/alert').then((r) => r.DocAlertComponent),
          },
          {
            path: 'components/fullscreen',
            loadComponent: () => import('@msk/docs/panel/components/fullscreen').then((r) => r.DocFullscreenComponent),
          },
          {
            path: 'components/highlight',
            loadComponent: () => import('@msk/docs/panel/components/highlight').then((r) => r.DocHighlightComponent),
          },
          {
            path: 'components/loading-bar',
            loadComponent: () => import('@msk/docs/panel/components/loading-bar').then((r) => r.DocLoadingBarComponent),
          },
          {
            path: 'components/navigation',
            loadComponent: () => import('@msk/docs/panel/components/navigation').then((r) => r.DocNavigationComponent),
          },
          // Services
          {
            path: 'services/confirmation',
            loadComponent: () =>
              import('@msk/docs/panel/services/confirmation').then((r) => r.DocsConfirmationComponent),
          },
          {
            path: 'services/snackbar',
            loadComponent: () => import('@msk/docs/panel/services/snack-bar').then((r) => r.DocsSnackBarComponent),
          },
          {
            path: 'services/splash-screen',
            loadComponent: () =>
              import('@msk/docs/panel/services/splash-screen').then((r) => r.DocsSplashScreenComponent),
          },
          {
            path: 'services/media-watcher',
            loadComponent: () =>
              import('@msk/docs/panel/services/media-watcher').then((r) => r.DocsMediaWatcherComponent),
          },
          // Pages
          {
            path: 'pages/not-found',
            loadChildren: () => import('@msk/shared/pages/errors/not-found').then((r) => r.routes),
          },
          {
            path: 'pages/internal-server-error',
            loadChildren: () => import('@msk/shared/pages/errors/internal-server-error').then((r) => r.routes),
          },
          {
            path: 'pages/maintenance',
            loadChildren: () => import('@msk/shared/pages/errors/maintenance').then((r) => r.routes),
          },
          // Page layouts
          {
            path: 'page-layouts',
            loadChildren: () => import('@msk/docs/panel/page-layouts').then((r) => r.routes),
          },
        ],
      },
    ],
  },

  // Error routes & Catch all
  {
    path: '',
    component: DocsLayoutComponent,
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
