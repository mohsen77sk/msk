import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, isDevMode, Provider } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { MskServiceWorkerService } from './service-worker.service';

export const provideMskServiceWorker = (): Array<Provider | EnvironmentProviders> => {
  return [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(MskServiceWorkerService),
      multi: true,
    },
  ];
};
