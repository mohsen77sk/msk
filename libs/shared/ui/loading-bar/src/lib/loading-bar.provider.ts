import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';
import { MskLoadingBarService } from './loading-bar.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { mskLoadingBarInterceptor } from './loading-bar.interceptor';

export const provideMskLoadingBar = (): Array<Provider | EnvironmentProviders> => {
  return [
    provideHttpClient(withInterceptors([mskLoadingBarInterceptor])),
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(MskLoadingBarService),
      multi: true,
    },
  ];
};
