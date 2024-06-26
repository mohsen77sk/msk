import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';
import { MskIconsService } from './icons.service';

export const provideMskIcons = (): Array<Provider | EnvironmentProviders> => {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(MskIconsService),
      multi: true,
    },
  ];
};
