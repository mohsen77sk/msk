import { Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { faIR } from 'date-fns-jalali/locale';
import { Direction } from '@angular/cdk/bidi';

export type MskAvailableLangsIds = 'en' | 'fa';

export interface MskLanguageConfig {
  id: MskAvailableLangsIds;
  label: string;
  locale: string;
  direction: Direction;
  localeDate: Locale;
}

export const availableLangs: MskLanguageConfig[] = [
  {
    id: 'en',
    label: 'languages.en',
    locale: 'en-US',
    direction: 'ltr',
    localeDate: enUS,
  },
  {
    id: 'fa',
    label: 'languages.fa',
    locale: 'fa-IR',
    direction: 'rtl',
    localeDate: faIR,
  },
];

// Lookup table
export const LANG_BY_ID = availableLangs.reduce(
  (acc, lang) => ({ ...acc, [lang.id]: lang }),
  {} as Record<MskAvailableLangsIds, MskLanguageConfig>,
);
