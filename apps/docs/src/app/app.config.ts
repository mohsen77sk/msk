import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import { LANG_BY_ID } from '@msk/shared/constants';
import { provideDocsShell } from '@msk/docs/shell/feature';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideDocsShell({
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
