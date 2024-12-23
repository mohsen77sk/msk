import {
  EnvironmentProviders,
  importProvidersFrom,
  inject,
  isDevMode,
  Provider,
  provideEnvironmentInitializer,
} from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideServiceWorker } from '@angular/service-worker';
import { provideTranslocoScope } from '@jsverse/transloco';
import { scopeLoader } from '@msk/shared/utils/transloco';
import { MskServiceWorkerService } from './service-worker.service';

export const provideMskServiceWorker = (): Array<Provider | EnvironmentProviders> => {
  return [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideEnvironmentInitializer(() => inject(MskServiceWorkerService)),
    importProvidersFrom(MatSnackBarModule),
    provideTranslocoScope({
      scope: 'serviceWorker',
      loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
    }),
  ];
};
