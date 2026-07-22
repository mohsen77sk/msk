import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { EnvironmentProviders, inject, Provider, provideEnvironmentInitializer } from '@angular/core';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

export const provideAuth = (): Array<Provider | EnvironmentProviders> => {
  return [
    provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
    provideEnvironmentInitializer(() => inject(AuthService)),
  ];
};
