export type MskAvailableCurrencyCodes = 'IRR' | 'IRT';

export interface MskCurrencyConfig {
  code: MskAvailableCurrencyCodes;
  label: string;
  intlCode: string;
  fraction: number;
  multiplier?: number;
}

export const availableCurrencies: MskCurrencyConfig[] = [
  {
    code: 'IRR',
    label: 'currency.IRR',
    intlCode: 'IRR',
    fraction: 0,
    multiplier: 1,
  },
  {
    code: 'IRT',
    label: 'currency.IRT',
    intlCode: 'IRR', // چون Intl تومان ساپورت نمی‌کنه
    fraction: 0,
    multiplier: 10,
  },
];

// Lookup table
export const CURRENCY_BY_CODE = availableCurrencies.reduce(
  (acc, c) => ({ ...acc, [c.code]: c }),
  {} as Record<MskAvailableCurrencyCodes, MskCurrencyConfig>,
);
