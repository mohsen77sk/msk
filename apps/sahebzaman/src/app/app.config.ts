import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { locale } from '@msk/sahebzaman/shell/ui/layout';
import { provideShell } from '@msk/sahebzaman/shell/feature';
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
      locale: locale['fa'],
      currencyCode: 'IRR',
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
