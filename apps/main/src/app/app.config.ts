import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideShell } from '@msk/main/shell/feature';
import { provideAppConfig } from '@msk/shared/utils/app-config';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    provideAppConfig(environment),
    provideShell({
      language: 'en',
      direction: 'ltr',
      type: 'classic',
      scheme: 'auto',
      screens: {
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1440px',
      },
      theme: 'theme-default',
      themes: [
        {
          id: 'theme-default',
          name: 'Default',
        },
        {
          id: 'theme-teal',
          name: 'Teal',
        },
        {
          id: 'theme-rose',
          name: 'Rose',
        },
        {
          id: 'theme-purple',
          name: 'Purple',
        },
        {
          id: 'theme-amber',
          name: 'Amber',
        },
      ],
    }),
  ],
};
