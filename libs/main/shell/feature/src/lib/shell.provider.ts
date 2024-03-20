import { EnvironmentProviders, Provider } from '@angular/core';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { provideIcons } from '@msk/shared/utils/icons';

import { appRoutes } from './shell.routes';

/**
 * Shell provider
 */
export const provideShell = (): Array<Provider | EnvironmentProviders> => {
  // Base providers
  const providers: Array<Provider | EnvironmentProviders> = [
    {
      // Disable 'theme' sanity check
      provide: MATERIAL_SANITY_CHECKS,
      useValue: {
        doctype: true,
        theme: false,
        version: true,
      },
    },
    {
      // Use the 'fill' appearance on Angular Material form fields by default
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill',
      },
    },

    provideRouter(
      appRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),

    provideIcons(),
  ];

  // Return the providers
  return providers;
};
