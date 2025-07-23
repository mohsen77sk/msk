import { SortDirection } from '@angular/material/sort';
import { ProductItem } from '@msk/mirza/panel/products';
import { PaymentTypeDetail } from '@msk/mirza/shell/core/payment-type';
import { User } from '@msk/mirza/shell/core/user';

export const DefaultSalesSortId = 'number';
export const DefaultSalesSortDirection: SortDirection = 'asc';

export class SaleInvoice {
  id: number;
  number: string;
  saleDate?: Date;
  paymentTypes: PaymentTypeDetail[];
  saleItems: ProductItem[];
  discount: number;
  total: number;
  user?: User;
  note?: string;

  constructor(input: SaleInvoice) {
    this.id = input.id;
    this.number = input.number;
    this.saleDate = input.saleDate ? new Date(input.saleDate) : undefined;
    this.paymentTypes = input.paymentTypes?.map((pt) => new PaymentTypeDetail(pt));
    this.saleItems = input.saleItems?.map((si) => new ProductItem(si));
    this.discount = input.discount;
    this.total = input.total;
    this.user = input.user ? new User(input.user) : undefined;
    this.note = input.note;
  }
}
