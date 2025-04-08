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
            loadComponent: () => import('@msk/shared/animations').then((r) => r.MskDocsAnimationComponent),
          },
          {
            path: 'colors',
            loadComponent: () => import('@msk/docs/panel/colors').then((r) => r.DocsPanelColorsComponent),
          },
          {
            path: 'typography',
            loadComponent: () => import('@msk/docs/panel/typography').then((r) => r.DocsPanelTypographyComponent),
          },
          // Ui
          {
            path: 'ui/alert',
            loadComponent: () => import('@msk/shared/ui/alert').then((r) => r.MskDocsAlertComponent),
          },
          {
            path: 'ui/fullscreen',
            loadComponent: () => import('@msk/shared/ui/fullscreen').then((r) => r.MskDocsFullscreenComponent),
          },
          {
            path: 'ui/highlight',
            loadComponent: () => import('@msk/shared/ui/highlight').then((r) => r.MskDocsHighlightComponent),
          },
          {
            path: 'ui/loading-bar',
            loadComponent: () => import('@msk/shared/ui/loading-bar').then((r) => r.MskDocsLoadingBarComponent),
          },
          {
            path: 'ui/navigation',
            loadComponent: () => import('@msk/shared/ui/navigation').then((r) => r.MskDocsNavigationComponent),
          },
          // Services
          {
            path: 'services/confirmation',
            loadComponent: () =>
              import('@msk/shared/services/confirmation').then((r) => r.MskDocsConfirmationComponent),
          },
          {
            path: 'services/snackbar',
            loadComponent: () => import('@msk/shared/services/snack-bar').then((r) => r.MskDocsSnackbarComponent),
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
