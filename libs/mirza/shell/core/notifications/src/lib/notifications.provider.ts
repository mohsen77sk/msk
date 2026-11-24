import { EnvironmentProviders, inject, provideEnvironmentInitializer } from '@angular/core';
import { NotificationsService } from './notifications.service';

/** Starts the realtime channel for order notifications when the app boots. */
export const provideNotifications = (): EnvironmentProviders =>
  provideEnvironmentInitializer(() => inject(NotificationsService).start());
