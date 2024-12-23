import { EnvironmentProviders, inject, isDevMode, LOCALE_ID, Provider, provideAppInitializer } from '@angular/core';
import {
  provideTransloco,
  TranslocoService,
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco.http-loader';
import { availableLangs } from './transloco.types';
import { firstValueFrom } from 'rxjs';

export const provideMskTransloco = (): Array<Provider | EnvironmentProviders> => {
  return [
    provideTransloco({
      config: {
        availableLangs: availableLangs,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(() => {
      const initializerFn = (() => {
        // Get lang id from locale
        const lang_id = inject(LOCALE_ID).slice(0, 2);
        // Set default and active language
        const translocoService = inject(TranslocoService);
        translocoService.setDefaultLang(lang_id);
        translocoService.setActiveLang(lang_id);
        // Load active language
        return () => firstValueFrom(translocoService.load(lang_id));
      })();
      return initializerFn();
    }),
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
