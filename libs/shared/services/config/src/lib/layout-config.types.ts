import { Direction } from '@angular/cdk/bidi';

// -------------------- TYPES --------------------
export type LayoutLocale = { id: string; direction: Direction };
export type LayoutCurrencyCode = string;
export type LayoutCalenderType = 'gregorian' | 'jalali';
export type LayoutScheme = 'auto' | 'dark' | 'light';
export type LayoutScreens = { [key: string]: string };
export type LayoutTheme = 'theme-default' | string;
export type LayoutThemes = { id: string; name: string }[];
export type LayoutType = 'empty' | 'material';

// -------------------- CONFIG INTERFACE --------------------
export interface LayoutConfig {
  locale: LayoutLocale;
  currencyCode: LayoutCurrencyCode;
  calenderType: LayoutCalenderType;
  screens: LayoutScreens;
  scheme: LayoutScheme;
  themes: LayoutThemes;
  theme: LayoutTheme;
  type: LayoutType;
}
