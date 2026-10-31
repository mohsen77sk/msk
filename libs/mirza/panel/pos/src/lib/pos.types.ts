import { ProductUnit } from '@msk/mirza/panel/products';
import { normalizeDigits } from '@msk/shared/utils/number';

export interface PosCategory {
  id: number;
  name: string;
}

export interface PosProduct {
  id: number;
  name: string;
  code: number | null;
  sellPrice: number;
  categoryId: number | null;
  unit: ProductUnit;
}

/**
 * GET /product/catalog
 */
export interface PosCatalog {
  categories: PosCategory[];
  products: PosProduct[];
  topProductIds: number[];
}

/**
 * Selected category tab: everything, the top sellers, or one category
 */
export type PosCategoryTab = 'all' | 'top' | number;

export interface PosCartLine {
  productId: number;
  name: string;
  // sellPrice when the product was added
  unitPrice: number;
  quantity: number;
  // Quick-note keys (see POS_QUICK_NOTES)
  notes: PosQuickNote[];
}

export interface PosSelectedCustomer {
  id: number;
  name: string;
  contactNumber?: string;
}

export type PosPaymentMode = 'single' | 'split';

/**
 * In-progress cart kept in sessionStorage per store
 */
export interface PosCartState {
  lines: PosCartLine[];
  selectedProductId: number | null;
  customer: PosSelectedCustomer | null;
  discount: number;
  note: string;
  paymentMode: PosPaymentMode;
  paymentTypeId: number | null;
  splitValues: Record<number, number>;
}

/**
 * Quick-note chips; labels live in i18n under pos.quick-notes. Store-configurable later.
 */
export const POS_QUICK_NOTES = [
  'no-sugar',
  'extra-sugar',
  'almond-milk',
  'extra-milk',
  'decaf',
  'extra-hot',
  'less-ice',
  'takeaway',
] as const;

export type PosQuickNote = (typeof POS_QUICK_NOTES)[number];

/**
 * Text used for matching: Latin digits, Persian ی/ک, lower case
 * @param value
 */
export function normalizePosSearch(value: string): string {
  return normalizeDigits(value).replace(/ي/g, 'ی').replace(/ك/g, 'ک').trim().toLowerCase();
}
