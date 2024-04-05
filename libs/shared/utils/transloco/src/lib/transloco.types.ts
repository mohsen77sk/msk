import { Direction } from '@angular/cdk/bidi';

export type AvailableLangsIds = 'en' | 'fa';

export interface AvailableLangs {
  id: AvailableLangsIds;
  label: string;
  direction: Direction;
}

export const availableLangs: AvailableLangs[] = [
  {
    id: 'en',
    label: 'English',
    direction: 'ltr',
  },
  {
    id: 'fa',
    label: 'فارسی',
    direction: 'rtl',
  },
];
