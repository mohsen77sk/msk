export type LayoutDirection = 'ltr' | 'rtl';
export type LayoutScheme = 'auto' | 'dark' | 'light';
export type LayoutScreens = { [key: string]: string };
export type LayoutTheme = 'theme-default' | string;
export type LayoutThemes = { id: string; name: string }[];
export type LayoutType =
  | 'empty'
  // Horizontal
  | 'centered'
  | 'enterprise'
  | 'material'
  | 'modern'
  // Vertical
  | 'classic'
  | 'classy'
  | 'compact'
  | 'dense'
  | 'futuristic'
  | 'thin';

export interface LayoutConfig {
  language: string;
  direction: LayoutDirection;
  screens: LayoutScreens;
  scheme: LayoutScheme;
  themes: LayoutThemes;
  theme: LayoutTheme;
  type: LayoutType;
}
