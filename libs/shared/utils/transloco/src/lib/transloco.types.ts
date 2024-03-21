export type AvailableLangsIds = 'en' | 'fa';

export interface AvailableLangs {
  id: AvailableLangsIds;
  label: string;
}

export const availableLangs: AvailableLangs[] = [
  {
    id: 'en',
    label: 'English',
  },
  {
    id: 'fa',
    label: 'فارسی',
  },
];
