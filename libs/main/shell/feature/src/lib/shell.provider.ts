import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, Provider, inject } from '@angular/core';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideDateFnsAdapter } from 'ngx-material-date-fns-adapter';

import { MSK_LAYOUT_CONFIG, LayoutConfig } from '@msk/shared/services/config';
import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';
import { MskPlatformService } from '@msk/shared/services/platform';
import { MskSplashScreenService } from '@msk/shared/services/splash-screen';
import { MskUtilsService } from '@msk/shared/services/utils';
import { provideMskIcons } from '@msk/shared/utils/icons';
import { provideMskServiceWorker } from '@msk/shared/utils/service-worker';
import { provideMskTransloco } from '@msk/shared/utils/transloco';
import { provideMskLoadingBar } from '@msk/shared/ui/loading-bar';

import { mainRoutes } from './shell.routes';

/**
 * Shell provider
 */
export const provideMainShell = (config: LayoutConfig): Array<Provider | EnvironmentProviders> => {
  // Base providers
  const providers: Array<Provider | EnvironmentProviders> = [
    {
      // Disable 'theme' sanity check
      provide: MATERIAL_SANITY_CHECKS,
      useValue: {
        doctype: true,
        theme: false,
        version: true,
      },
    },
    {
      // Use the 'fill' appearance on Angular Material form fields by default
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill',
      },
    },
    {
      provide: MSK_LAYOUT_CONFIG,
      useValue: config ?? {},
    },

    // Route
    provideRouter(
      mainRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),

    // Service Worker
    provideMskServiceWorker(),

    // Material Date Adapter
    provideDateFnsAdapter(),

    // Provide utils
    provideMskIcons(),
    provideMskTransloco(),
    provideMskLoadingBar(),
    // Provide services
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(MskMediaWatcherService),
      multi: true,
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(MskPlatformService),
      multi: true,
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(MskSplashScreenService),
      multi: true,
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(MskUtilsService),
      multi: true,
    },
  ];

  // Return the providers
  return providers;
};
