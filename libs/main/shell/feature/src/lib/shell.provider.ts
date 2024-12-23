import {
  DEFAULT_CURRENCY_CODE,
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  LOCALE_ID,
  Provider,
  inject,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import { MAT_DATE_LOCALE, MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideDateFnsAdapter } from 'ngx-material-date-fns-adapter';

import { MSK_LAYOUT_CONFIG, LayoutConfig, MskLayoutConfigService } from '@msk/shared/services/config';
import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';
import { MskPlatformService } from '@msk/shared/services/platform';
import { MskSplashScreenService } from '@msk/shared/services/splash-screen';
import { MskUtilsService } from '@msk/shared/services/utils';
import { provideMskIcons } from '@msk/shared/utils/icons';
import { provideMskServiceWorker } from '@msk/shared/utils/service-worker';
import { provideMskTransloco } from '@msk/shared/utils/transloco';
import { provideMskLoading } from '@msk/shared/utils/loading';
import { provideMainAuth } from '@msk/main/shell/core/auth';

import { mainRoutes } from './shell.routes';

import localeFaIR from '@angular/common/locales/fa';
import { localeDate } from '@msk/main/shell/ui/layout';
registerLocaleData(localeFaIR, 'fa-IR');

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
    {
      provide: LOCALE_ID,
      useFactory: (): string => {
        const layoutConfigService = inject(MskLayoutConfigService);
        return layoutConfigService.config.locale.id;
      },
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useFactory: (): string => {
        const layoutConfigService = inject(MskLayoutConfigService);
        return layoutConfigService.config.locale.currencyCode;
      },
    },
    {
      provide: MAT_DATE_LOCALE,
      useFactory: () => {
        const locale = inject(LOCALE_ID);
        return localeDate[locale.split('-')[0]];
      },
    },
    {
      // Set the default direction by default
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useFactory: (): MatDialogConfig => {
        const layoutConfigService = inject(MskLayoutConfigService);
        return { direction: layoutConfigService.config.locale.direction };
      },
    },

    // Route
    provideRouter(
      mainRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),

    // Provide Auth
    provideMainAuth(),

    // Material Date Adapter
    provideDateFnsAdapter(),

    // Provide utils
    provideMskIcons(),
    provideMskLoading(),
    provideMskTransloco(),
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

    // Service Worker
    provideMskServiceWorker(),
  ];

  // Return the providers
  return providers;
};
