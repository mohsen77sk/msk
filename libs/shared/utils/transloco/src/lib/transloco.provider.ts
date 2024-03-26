import { APP_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';
import { provideTransloco, TranslocoService } from '@ngneat/transloco';
import { availableLangs } from './transloco.types';
import { TranslocoHttpLoader } from './transloco.http-loader';
import { firstValueFrom } from 'rxjs';

export const provideMskTransloco = (): Array<Provider | EnvironmentProviders> => {
  return [
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
  ];
};
