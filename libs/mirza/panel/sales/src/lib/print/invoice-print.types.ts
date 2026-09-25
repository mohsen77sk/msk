import { ProductItem } from '@msk/mirza/panel/products';
import { SaleInvoice } from '../sales.types';
import { Store } from '@msk/mirza/shell/core/store';

const TOTAL_MISMATCH_EPSILON = 0.01;

export class InvoicePrintData {
  storeName: string;
  storeLogoUrl?: string;
  storeEconomicCode?: string;
  storeNationalId?: string;
  storeAddress?: string;
  storePostalCode?: string;
  storePhone?: string;

  saleId: number;
  saleNumber: string;
  saleDate?: Date;

  customerName?: string;
  customerAddress?: string;
  customerContactNumber?: string;

  items: InvoiceLineItem[];

  itemsSubtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  // The stored, authoritative sale total. Always what's rendered as the
  // final amount - never recomputed from the lines below.
  total: number;

  constructor(input: SaleInvoice, store: Store | null) {
    this.storeName = store?.name ?? '';
    this.storeLogoUrl = store?.logoUrl;
    this.storeEconomicCode = store?.economicCode;
    this.storeNationalId = store?.nationalId;
    this.storeAddress = store?.address;
    this.storePostalCode = store?.postalCode;
    this.storePhone = store?.phone;

    this.saleId = input.id;
    this.saleNumber = input.number;
    this.saleDate = input.saleDate;

    this.customerName = input.customer?.name;
    this.customerAddress = input.customer?.address;
    this.customerContactNumber = input.customer?.contactNumber;

    this.items = (input.saleItems ?? []).map((item) => new InvoiceLineItem(item));

    this.discount = input.discount ?? 0;
    this.tax = input.tax ?? 0;
    this.deliveryFee = input.deliveryFee ?? 0;
    this.total = input.total ?? 0;

    this.itemsSubtotal = this.items.reduce((sum, item) => sum + item.lineTotal, 0);

    this._warnIfTotalMismatch();
  }

  get hasAdjustments(): boolean {
    return this.discount > 0 || this.tax > 0 || this.deliveryFee > 0;
  }

  /**
   * Sale-creation/financial code owns the stored `total`; this only warns
   * when the displayed breakdown doesn't reconcile with it, and never
   * recomputes or overrides what's actually shown on the invoice.
   */
  private _warnIfTotalMismatch(): void {
    const recomputed = this.itemsSubtotal - this.discount + this.tax + this.deliveryFee;

    if (Math.abs(recomputed - this.total) > TOTAL_MISMATCH_EPSILON) {
      console.warn(
        `[sale invoice] total mismatch for sale id=${this.saleId} (number=${this.saleNumber}): ` +
          `stored total=${this.total}, recomputed sum=${recomputed} ` +
          `(itemsSubtotal=${this.itemsSubtotal} - discount=${this.discount} + tax=${this.tax} + deliveryFee=${this.deliveryFee}). ` +
          'The invoice displays the stored total regardless.',
      );
    }
  }
}

export class InvoiceLineItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;

  constructor(input: ProductItem) {
    this.productName = input.product?.name ?? '-';
    this.quantity = input.quantity;
    this.lineTotal = input.total;
    this.unitPrice = input.product?.sellPrice ?? (this.quantity ? this.lineTotal / this.quantity : 0);
  }
}
