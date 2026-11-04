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

/**
 * A line is one product with one note set: the same product can be on several lines
 */
export interface PosCartLine {
  // Client-side only, unique within the cart
  id: number;
  productId: number;
  name: string;
  // sellPrice when the product was added
  unitPrice: number;
  quantity: number;
  // Note parts: quick-note labels and free text, joined into the sale line note
  notes: string[];
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
  selectedLineId: number | null;
  customer: PosSelectedCustomer | null;
  discount: number;
  note: string;
  paymentMode: PosPaymentMode;
  paymentTypeId: number | null;
  splitValues: Record<number, number>;
}

/**
 * Carts saved while quick notes were hardcoded hold these keys; they become the labels the
 * stores were seeded with
 */
export const LEGACY_POS_QUICK_NOTE_LABELS: Record<string, string> = {
  'no-sugar': 'بدون شکر',
  'extra-sugar': 'شکر اضافه',
  'almond-milk': 'شیر بادام',
  'extra-milk': 'شیر اضافه',
  decaf: 'کم‌کافئین',
  'extra-hot': 'داغ‌تر',
  'less-ice': 'یخ کم',
  takeaway: 'برای بیرون',
};

/**
 * Same notes, in any order
 * @param a
 * @param b
 */
export function samePosNotes(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((note) => b.includes(note));
}

/**
 * Text used for matching: Latin digits, Persian ی/ک, lower case
 * @param value
 */
export function normalizePosSearch(value: string): string {
  return normalizeDigits(value).replace(/ي/g, 'ی').replace(/ك/g, 'ک').trim().toLowerCase();
}
