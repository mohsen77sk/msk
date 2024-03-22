import { APP_INITIALIZER, ENVIRONMENT_INITIALIZER, EnvironmentProviders, Provider, inject } from '@angular/core';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { TranslocoService, provideTransloco } from '@ngneat/transloco';
import { provideDateFnsAdapter } from 'ngx-material-date-fns-adapter';
import { firstValueFrom } from 'rxjs';

import { LAYOUT_CONFIG, LayoutConfig } from '@msk/shared/services/config';
import { MediaWatcherService } from '@msk/shared/services/media-watcher';
import { PlatformService } from '@msk/shared/services/platform';
import { provideIcons } from '@msk/shared/utils/icons';
import { TranslocoHttpLoader, availableLangs } from '@msk/shared/utils/transloco';

import { appRoutes } from './shell.routes';

/**
 * Shell provider
 */
export const provideShell = (config: LayoutConfig): Array<Provider | EnvironmentProviders> => {
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
      provide: LAYOUT_CONFIG,
      useValue: config ?? {},
    },

    // Route
    provideRouter(
      appRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),

    // Material Date Adapter
    provideDateFnsAdapter(),

    // Transloco Config
    provideTransloco({
      config: {
        availableLangs: availableLangs,
        reRenderOnLangChange: true,
        prodMode: true,
      },
      loader: TranslocoHttpLoader,
    }),
    {
      // Preload the default language before the app starts to prevent empty/jumping content
      provide: APP_INITIALIZER,
      useFactory: () => {
        const translocoService = inject(TranslocoService);
        const defaultLang = translocoService.getDefaultLang();
        translocoService.setActiveLang(defaultLang);

        return () => firstValueFrom(translocoService.load(defaultLang));
      },
      multi: true,
    },

    provideIcons(),

    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(MediaWatcherService),
      multi: true,
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(PlatformService),
      multi: true,
    },
  ];

  // Return the providers
  return providers;
};
