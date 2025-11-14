import { availableLangs } from '@msk/shared/constants';

/**
 * Transloco scope inline loader
 *
 * @example
 * ```
 * provideTranslocoScope({
 *  scope: 'scope',
 *  loader: scopeLoader((lang: string, root: string) => import(`./${root}/${lang}.json`)),
 * }),
 * ```
 */
export const scopeLoader = (importer: any, root = 'i18n') => {
  return availableLangs.reduce((acc: any, lang) => {
    acc[lang.id] = () => importer(lang.id, root);
    return acc;
  }, {});
};
