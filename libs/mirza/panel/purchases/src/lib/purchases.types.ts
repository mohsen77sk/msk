import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SortDirection } from '@angular/material/sort';
import { Vendor } from '@msk/mirza/panel/vendors';
import { Product, ProductItem } from '@msk/mirza/panel/products';
import { PaymentTypeDetail } from '@msk/mirza/shell/core/payment-type';
import { User } from '@msk/mirza/shell/core/user';

export const DefaultPurchasesSortId = 'number';
export const DefaultPurchasesSortDirection: SortDirection = 'desc';

export class PurchaseInvoice {
  id: number;
  number: string;
  date?: Date;
  paymentTypes: PaymentTypeDetail[];
  purchaseItems: ProductItem[];
  discount: number;
  total: number;
  user?: User;
  vendor?: Vendor;
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
    this.vendor = input.vendor ? new Vendor(input.vendor) : undefined;
    this.note = input.note;
  }
}

export interface ICreatePurchaseInvoice {
  id: number;
  vendorId: number | null;
  date: string;
  paymentTypes: PaymentTypeDetail[];
  purchaseItems: ProductItem[];
  discount: number;
  total: number;
  note?: string;
}

export interface IPurchaseForm {
  id: FormControl<number | null>;
  vendor: FormControl<Vendor | null>;
  date: FormControl<Date | null>;
  paymentTypes: FormArray<FormGroup<IPaymentTypeForm>>;
  purchaseItems: FormArray<FormGroup<IPurchaseItemForm>>;
  discount: FormControl<number | null>;
  total: FormControl<number | null>;
  note: FormControl<string | null>;
}
export interface IPaymentTypeForm {
  paymentType: FormControl<string | null>;
  value: FormControl<number | null>;
}
export interface IPurchaseItemForm {
  product: FormControl<Product | null>;
  quantity: FormControl<number | null>;
  total: FormControl<number | null>;
}
