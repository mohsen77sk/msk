import { provideTranslocoScope } from '@jsverse/transloco';
import { scopeLoader } from '@msk/shared/utils/transloco';

/**
 * Translations of the menu scope; also provided by the settings page, which opens the menu dialogs
 */
export function provideMenuTranslocoScope() {
  return provideTranslocoScope({
    scope: 'menu',
    loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
  });
}
