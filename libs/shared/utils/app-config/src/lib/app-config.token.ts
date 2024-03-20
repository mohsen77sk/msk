import { InjectionToken, ValueProvider } from '@angular/core';
import { IAppConfig } from './app.config';

/**
 * APP_CONFIG
 */
export const APP_CONFIG = new InjectionToken<IAppConfig>('app.config');

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
export const provideAppConfig = (value: IAppConfig): ValueProvider => ({
  provide: APP_CONFIG,
  useValue: value,
});
