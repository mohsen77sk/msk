import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SortDirection } from '@angular/material/sort';
import { Customer } from '@msk/mirza/panel/customers';
import { Product, ProductItem } from '@msk/mirza/panel/products';
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
  customer?: Customer;
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
    this.customer = input.customer ? new Customer(input.customer) : undefined;
    this.note = input.note;
  }
}

export interface ICreateSaleInvoice {
  id: number;
  customerId: number;
  saleDate: string;
  paymentTypes: PaymentTypeDetail[];
  saleItems: ProductItem[];
  discount: number;
  total: number;
  note?: string;
}

export interface ISalesForm {
  id: FormControl<number | null>;
  customer: FormControl<Customer | null>;
  saleDate: FormControl<Date | null>;
  paymentTypes: FormArray<FormGroup<IPaymentTypeForm>>;
  saleItems: FormArray<FormGroup<ISaleItemForm>>;
  discount: FormControl<number | null>;
  total: FormControl<number | null>;
  note: FormControl<string | null>;
}
export interface IPaymentTypeForm {
  paymentType: FormControl<string | null>;
  value: FormControl<number | null>;
}
export interface ISaleItemForm {
  product: FormControl<Product | null>;
  quantity: FormControl<number | null>;
  total: FormControl<number | null>;
}
