import { EnvironmentProviders, inject, Provider, provideEnvironmentInitializer } from '@angular/core';
import { MskLoadingBarService } from '@msk/shared/ui/loading-bar';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { mskLoadingInterceptor } from './loading.interceptor';

export const provideMskLoading = (): Array<Provider | EnvironmentProviders> => {
  return [
    provideHttpClient(withXhr(), withInterceptors([mskLoadingInterceptor])),
    provideEnvironmentInitializer(() => inject(MskLoadingBarService)),
  ];
};
