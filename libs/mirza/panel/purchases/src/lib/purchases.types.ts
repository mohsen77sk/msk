import { SortDirection } from '@angular/material/sort';
import { ProductItem } from '@msk/mirza/panel/products';
import { PaymentTypeDetail } from '@msk/mirza/shell/core/payment-type';
import { User } from '@msk/mirza/shell/core/user';

export const DefaultPurchasesSortId = 'number';
export const DefaultPurchasesSortDirection: SortDirection = 'asc';

export class PurchaseInvoice {
  id: number;
  number: string;
  date?: Date;
  paymentTypes: PaymentTypeDetail[];
  purchaseItems: ProductItem[];
  discount: number;
  total: number;
  user?: User;
  note?: string;

  constructor(input: PurchaseInvoice) {
    this.id = input.id;
    this.number = input.number;
    this.date = input.date ? new Date(input.date) : undefined;
    this.paymentTypes = input.paymentTypes?.map((pt) => new PaymentTypeDetail(pt));
    this.purchaseItems = input.purchaseItems?.map((si) => new ProductItem(si));
    this.discount = input.discount;
    this.total = input.total;
    this.user = input.user ? new User(input.user) : undefined;
    this.note = input.note;
  }
}

export interface ICreatePurchaseInvoice {
  id: number;
  vendorId: number;
  date: string;
  paymentTypes: PaymentTypeDetail[];
  purchaseItems: ProductItem[];
  discount: number;
  total: number;
  note?: string;
}
