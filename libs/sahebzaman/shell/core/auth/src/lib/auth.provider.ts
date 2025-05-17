import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, inject, Provider, provideEnvironmentInitializer } from '@angular/core';
import { mainAuthInterceptor } from './auth.interceptor';
import { MainAuthService } from './auth.service';

export const provideMainAuth = (): Array<Provider | EnvironmentProviders> => {
  return [
    provideHttpClient(withInterceptors([mainAuthInterceptor])),
    provideEnvironmentInitializer(() => inject(MainAuthService)),
  ];
};
