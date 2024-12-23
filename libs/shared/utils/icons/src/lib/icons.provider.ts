import { EnvironmentProviders, inject, Provider, provideEnvironmentInitializer } from '@angular/core';
import { MskIconsService } from './icons.service';

export const provideMskIcons = (): Array<Provider | EnvironmentProviders> => {
  return [provideEnvironmentInitializer(() => inject(MskIconsService))];
};
