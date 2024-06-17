import { InjectionToken, ValueProvider } from '@angular/core';
import { AppConfig } from './app.config';

/**
 * APP_CONFIG
 */
export const MSK_APP_CONFIG = new InjectionToken<AppConfig>('app.config');

/**
 * Configures APP_CONFIG to be available for injection.
 *
 * @usage
 * ```typescript
 * ApplicationConfig = {
 *   providers: [..., providerAppConfig(environment)]
 * };
 * ```
 *
 * @param value pass environment value
 */
export const provideMskAppConfig = (value: AppConfig): ValueProvider => ({
  provide: MSK_APP_CONFIG,
  useValue: value,
});

export const provideTestMskAppConfig = (): ValueProvider => ({
  provide: MSK_APP_CONFIG,
  useValue: { production: false, apiEndpoint: '' },
});
