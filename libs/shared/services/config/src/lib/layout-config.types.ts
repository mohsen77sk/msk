import { Direction } from '@angular/cdk/bidi';

export type LayoutLocale = { id: string; direction: Direction; currencyCode: string };
export type LayoutScheme = 'auto' | 'dark' | 'light';
export type LayoutScreens = { [key: string]: string };
export type LayoutTheme = 'theme-default' | string;
export type LayoutThemes = { id: string; name: string }[];
export type LayoutType = 'empty' | 'material';

export interface LayoutConfig {
  locale: LayoutLocale;
  screens: LayoutScreens;
  scheme: LayoutScheme;
  themes: LayoutThemes;
  theme: LayoutTheme;
  type: LayoutType;
}
