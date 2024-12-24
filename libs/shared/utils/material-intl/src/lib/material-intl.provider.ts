import { EnvironmentProviders, Provider } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@jsverse/transloco';
import { MskPaginatorIntl } from './material-paginator-intl';

export const provideMskMatIntl = (): Array<Provider | EnvironmentProviders> => {
  return [
    {
      provide: MatPaginatorIntl,
      deps: [TranslocoService],
      useClass: MskPaginatorIntl,
    },
  ];
};
