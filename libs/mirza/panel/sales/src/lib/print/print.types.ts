import { ProductItem } from '@msk/mirza/panel/products';
import { SaleInvoice } from '../sales.types';
import { Store } from '@msk/mirza/shell/core/store';
import { PaymentTypeDetail } from '@msk/mirza/panel/payment-types';
import { Customer } from '@msk/mirza/panel/customers';

export interface PrintDocumentOptions {
  html: string;
  title?: string;
  styles?: string;
  windowFeatures?: string;
  imageLoadTimeoutMs?: number;
}

export class ReceiptPrintData {
  storeName: string;
  storeLogoUrl?: string;
  saleNumber: string;
  saleDate?: Date;
  customerName?: string;
  customerPhone?: string;
  items: ReceiptPrintItem[];
  subtotal: number;
  discount: number;
  total: number;
  payments: ReceiptPrintPayment[];
  footerText: string;

  constructor(input: SaleInvoice, store: Store) {
    this.storeName = store?.name ?? '';
    this.storeLogoUrl = store?.logoUrl;
    this.saleNumber = input.number;
    this.saleDate = input.saleDate;
    this.customerName = this._getCustomerName(input.customer);
    this.customerPhone = this._getCustomerPhone(input.customer);
    this.items = (input.saleItems ?? []).map((item) => new ReceiptPrintItem(item));
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.discount = input.discount ?? 0;
    this.total = input.total ?? 0;
    this.payments = (input.paymentTypes ?? []).map((item) => new ReceiptPrintPayment(item));
    this.footerText = 'Thank you';
  }

  private _getCustomerName(customer?: ReceiptCustomer): string | undefined {
    return customer?.name;
  }

  private _getCustomerPhone(customer?: ReceiptCustomer): string | undefined {
    return customer?.contactNumber;
  }
}

export class ReceiptPrintItem {
  productName: string;
  price: number;
  quantity: number;
  unit?: string;
  total: number;

  constructor(input: ProductItem) {
    this.productName = input.product?.name ?? '-';
    this.quantity = input.quantity;
    this.unit = input.product?.unit;
    this.total = input.total;
    this.price = input.product?.sellPrice ?? (this.quantity ? this.total / this.quantity : 0);
  }
}

export class ReceiptPrintPayment {
  name: string;
  value: number;

  constructor(input: PaymentTypeDetail) {
    this.name = input.paymentType?.name ?? '-';
    this.value = input.value;
  }
}

type ReceiptCustomer = Customer & {
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneNumber?: string;
};
