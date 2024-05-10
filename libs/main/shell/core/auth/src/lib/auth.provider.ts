import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';
import { mainAuthInterceptor } from './auth.interceptor';
import { MainAuthService } from './auth.service';

export const provideMainAuth = (): Array<Provider | EnvironmentProviders> => {
  return [
    provideHttpClient(withInterceptors([mainAuthInterceptor])),
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(MainAuthService),
      multi: true,
    },
  ];
};
