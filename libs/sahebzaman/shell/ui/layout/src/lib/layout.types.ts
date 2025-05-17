import { Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { faIR } from 'date-fns-jalali/locale';
import { LayoutLocale } from '@msk/shared/services/config';

export const locale: { [key: string]: LayoutLocale } = {
  en: {
    id: 'en-US',
    direction: 'ltr',
    currencyCode: 'IRR',
  },
  fa: {
    id: 'fa-IR',
    direction: 'rtl',
    currencyCode: 'IRR',
  },
};

export const localeDate: { [key: string]: Locale } = {
  en: enUS,
  fa: faIR,
};
