import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { LANG_BY_ID } from '@msk/shared/constants';
import { provideShell } from '@msk/onco/shell/feature';
import { provideMskAppConfig } from '@msk/shared/utils/app-config';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideMskAppConfig(environment),
    provideShell({
      lang: LANG_BY_ID['fa'].id,
      direction: LANG_BY_ID['fa'].direction,
      calendar: 'persian',
      currency: 'IRR',
      type: 'material',
      scheme: 'auto',
      screens: {
        sm: '600px',
        md: '840px',
        lg: '1200px',
        xl: '1600px',
      },
      theme: 'theme-default',
      themes: [
        {
          id: 'theme-default',
          name: 'Default',
        },
      ],
    }),
  ],
};
