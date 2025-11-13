import { Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { faIR } from 'date-fns-jalali/locale';
import { LayoutCalenderType, LayoutLocale } from '@msk/shared/services/config';

export const locale: { [key: string]: LayoutLocale } = {
  en: {
    id: 'en-US',
    direction: 'ltr',
  },
  fa: {
    id: 'fa-IR',
    direction: 'rtl',
  },
};

export const localeCalenderType: { [key: string]: LayoutCalenderType } = {
  en: 'gregorian',
  fa: 'jalali',
};

export const localeDate: { [key: string]: Locale } = {
  en: enUS,
  fa: faIR,
};
