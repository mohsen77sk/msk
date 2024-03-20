import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideShell } from '@msk/main/shell/feature';
import { provideAppConfig } from '@msk/shared/utils/app-config';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimationsAsync(), provideHttpClient(), provideAppConfig(environment), provideShell()],
};
