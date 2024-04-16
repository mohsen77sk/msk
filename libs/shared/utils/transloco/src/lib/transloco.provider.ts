import { APP_INITIALIZER, EnvironmentProviders, inject, isDevMode, LOCALE_ID, Provider } from '@angular/core';
import { provideTransloco, TranslocoService, TranslocoTestingModule, TranslocoTestingOptions } from '@ngneat/transloco';
import { TranslocoHttpLoader } from './transloco.http-loader';
import { availableLangs } from './transloco.types';
import { firstValueFrom } from 'rxjs';

export const provideMskTransloco = (): Array<Provider | EnvironmentProviders> => {
  return [
    provideTransloco({
      config: {
        availableLangs: availableLangs,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    {
      // Preload the default language before the app starts to prevent empty/jumping content
      provide: APP_INITIALIZER,
      useFactory: () => {
        // Get lang id from locale
        const lang_id = inject(LOCALE_ID).slice(0, 2);
        // Set default and active language
        const translocoService = inject(TranslocoService);
        translocoService.setDefaultLang(lang_id);
        translocoService.setActiveLang(lang_id);
        // Load active language
        return () => firstValueFrom(translocoService.load(lang_id));
      },
      multi: true,
    },
  ];
};

export function MskTranslocoTestingModule(options: TranslocoTestingOptions = {}) {
  return TranslocoTestingModule.forRoot({
    langs: {},
    translocoConfig: {
      availableLangs: availableLangs,
      defaultLang: availableLangs[0].id,
    },
    preloadLangs: true,
    ...options,
  });
}
