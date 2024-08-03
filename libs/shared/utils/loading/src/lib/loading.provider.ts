import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';
import { MskLoadingBarService } from '@msk/shared/ui/loading-bar';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { mskLoadingInterceptor } from './loading.interceptor';

export const provideMskLoading = (): Array<Provider | EnvironmentProviders> => {
  return [
    provideHttpClient(withInterceptors([mskLoadingInterceptor])),
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(MskLoadingBarService),
      multi: true,
    },
  ];
};
