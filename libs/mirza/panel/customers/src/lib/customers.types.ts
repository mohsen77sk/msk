import { MskSortable } from '@msk/shared/data-access';

export const DefaultCustomersSortData: MskSortable = { active: 'name', direction: 'asc' };

export enum GenderEnum {
  male = 'male',
  female = 'female',
  company = 'company',
}

export class Customer {
  id: number;
  name: string;
  gender: GenderEnum;
  contactNumber?: string;
  address?: string;
  note?: string;

  constructor(input: Customer) {
    this.id = input.id;
    this.name = input.name;
    this.gender = input.gender;
    this.contactNumber = input.contactNumber;
    this.address = input.address;
    this.note = input.note;
  }
}

export class CustomerSummary {
  orderCount: number;
  totalSales: number;
  totalDiscount: number;
  averageOrderValue: number;
  firstOrderDate?: Date;
  lastOrderDate?: Date;

  constructor(input: CustomerSummary) {
    this.orderCount = input.orderCount;
    this.totalSales = input.totalSales;
    this.totalDiscount = input.totalDiscount;
    this.averageOrderValue = input.averageOrderValue;
    this.firstOrderDate = input.firstOrderDate ? new Date(input.firstOrderDate) : undefined;
    this.lastOrderDate = input.lastOrderDate ? new Date(input.lastOrderDate) : undefined;
  }
}

export class CustomerOrderRow {
  id: number;
  number: string;
  saleDate?: Date;
  total: number;
  saleItems: { product?: { name?: string } }[];
  paymentTypes: {
    id?: number;
    paymentType?: { name?: string };
    value: number;
  }[];

  constructor(input: CustomerOrderRow) {
    this.id = input.id;
    this.number = input.number;
    this.saleDate = input.saleDate ? new Date(input.saleDate) : undefined;
    this.total = input.total;
    this.saleItems = input.saleItems ?? [];
    this.paymentTypes = input.paymentTypes ?? [];
  }

  get title(): string {
    return this.number + ' - ' + this.saleItems.map((i) => i.product?.name).join('/');
  }
}
