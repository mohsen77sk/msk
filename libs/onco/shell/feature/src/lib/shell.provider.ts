import {
  DEFAULT_CURRENCY_CODE,
  EnvironmentProviders,
  LOCALE_ID,
  Provider,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideDateFnsAdapter } from 'ngx-material-date-fns-adapter';

import { MSK_LAYOUT_CONFIG, LayoutConfig, MskLayoutConfigService } from '@msk/shared/services/config';
import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';
import { MskPlatformService } from '@msk/shared/services/platform';
import { MskSplashScreenService } from '@msk/shared/services/splash-screen';
import { MskUtilsService } from '@msk/shared/services/utils';
import { provideMskIcons } from '@msk/shared/utils/icons';
import { provideMskMatIntl } from '@msk/shared/utils/material-intl';
import { provideMskServiceWorker } from '@msk/shared/utils/service-worker';
import { provideMskTransloco } from '@msk/shared/utils/transloco';
import { provideMskLoading } from '@msk/shared/utils/loading';
import { provideAuth } from '@msk/onco/shell/core/auth';

import { routes } from './shell.routes';

import localeFaIR from '@angular/common/locales/fa';
import { localeDate } from '@msk/onco/shell/ui/layout';
registerLocaleData(localeFaIR, 'fa-IR');

/**
 * Shell provider
 */
export const provideShell = (config: LayoutConfig): Array<Provider | EnvironmentProviders> => {
  // Base providers
  const providers: Array<Provider | EnvironmentProviders> = [
    {
      // Use the 'outline' appearance on Angular Material form fields by default
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
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
        return layoutConfigService.config.currencyCode;
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
    {
      // Set the default direction by default
      provide: MAT_SNACK_BAR_DATA,
      useFactory: (): MatSnackBarConfig => {
        const layoutConfigService = inject(MskLayoutConfigService);
        return { direction: layoutConfigService.config.locale.direction };
      },
    },

    // Route
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),

    // Provide Auth
    provideAuth(),

    // Material Date Adapter
    provideDateFnsAdapter(),

    // Provide utils
    provideMskIcons(),
    provideMskLoading(),
    provideMskTransloco(),
    provideMskMatIntl(),
    // Provide services
    provideEnvironmentInitializer(() => inject(MskMediaWatcherService)),
    provideEnvironmentInitializer(() => inject(MskPlatformService)),
    provideEnvironmentInitializer(() => inject(MskSplashScreenService)),
    provideEnvironmentInitializer(() => inject(MskUtilsService)),

    // Service Worker
    provideMskServiceWorker(),
  ];

  // Return the providers
  return providers;
};
