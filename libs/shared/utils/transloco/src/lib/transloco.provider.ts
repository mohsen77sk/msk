import { APP_INITIALIZER, EnvironmentProviders, inject, isDevMode, Provider } from '@angular/core';
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
        const translocoService = inject(TranslocoService);
        const defaultLang = translocoService.getDefaultLang();
        translocoService.setActiveLang(defaultLang);

        return () => firstValueFrom(translocoService.load(defaultLang));
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
