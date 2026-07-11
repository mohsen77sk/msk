import { ErrorHandler, EnvironmentProviders, Provider, inject, provideAppInitializer } from '@angular/core';
import * as Sentry from '@sentry/angular';

import { environment } from '../environments/environment';

const isSentryEnabled = (): boolean => environment.production === true && !!environment.sentryDsn;

export const initSentry = (): void => {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.init({
    dsn: environment.sentryDsn,
    integrations: [Sentry.browserTracingIntegration()],
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });

  // TODO: Configure Sentry source-map upload later in GitHub Actions.
};

export const provideSentry = (): Array<Provider | EnvironmentProviders> => {
  if (!isSentryEnabled()) {
    return [];
  }

  return [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },
    provideAppInitializer(() => {
      inject(Sentry.TraceService);
    }),
  ];
};
