import { Direction } from '@angular/cdk/bidi';
import { MskAvailableCurrencyCodes, MskAvailableCalendarTypes, MskAvailableLangsIds } from '@msk/shared/constants';

// -------------------- TYPES --------------------
export type LayoutScheme = 'auto' | 'dark' | 'light';
export type LayoutScreens = { [key: string]: string };
export type LayoutTheme = 'theme-default' | string;
export type LayoutThemes = { id: string; name: string }[];
export type LayoutType = 'empty' | 'material';

// -------------------- CONFIG INTERFACE --------------------
export interface LayoutConfig {
  lang: MskAvailableLangsIds;
  direction: Direction;
  currency: MskAvailableCurrencyCodes;
  calendar: MskAvailableCalendarTypes;
  screens: LayoutScreens;
  scheme: LayoutScheme;
  themes: LayoutThemes;
  theme: LayoutTheme;
  type: LayoutType;
}
