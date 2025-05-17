import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { locale } from '@msk/sahebzaman/shell/ui/layout';
import { provideMainShell } from '@msk/sahebzaman/shell/feature';
import { provideMskAppConfig } from '@msk/shared/utils/app-config';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    provideMskAppConfig(environment),
    provideMainShell({
      locale: locale['fa'],
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
