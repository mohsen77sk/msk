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

export interface ICustomerOrderItem {
  product?: { name?: string };
}

export interface ICustomerOrderPaymentType {
  id?: number;
  paymentType?: { name?: string };
  value: number;
}

/**
 * A single row of a customer's order history (a trimmed projection of the
 * existing GET /sale?customerId=:id response - enough to match the main sales
 * list's row content: sale number + product names, payment type names, total,
 * and date - without pulling the full SaleInvoice model - and its
 * product/payment-type/user model dependencies - into this library, which would
 * create a circular dependency between the sales and customers feature
 * libraries (sales already depends on customers).
 */
export interface ICustomerOrderRow {
  id: number;
  number: string;
  saleDate?: Date;
  total: number;
  saleItems: ICustomerOrderItem[];
  paymentTypes: ICustomerOrderPaymentType[];
}

export interface ICustomerOrderSummary {
  orderCount: number;
  totalSales: number;
  totalDiscount: number;
  averageOrderValue: number;
  firstOrderDate?: Date;
  lastOrderDate?: Date;
}

/**
 * Response of GET /customer/:id/summary: customer info plus an aggregated order
 * summary. The two groups are intentionally separate so either can grow new
 * fields later (favorite products, payment-type breakdown, etc.) without breaking
 * existing consumers.
 */
export class CustomerSummary {
  customer: Customer;
  summary: ICustomerOrderSummary;

  constructor(input: CustomerSummary) {
    this.customer = new Customer(input.customer);
    this.summary = {
      orderCount: input.summary.orderCount,
      totalSales: input.summary.totalSales,
      totalDiscount: input.summary.totalDiscount,
      averageOrderValue: input.summary.averageOrderValue,
      firstOrderDate: input.summary.firstOrderDate ? new Date(input.summary.firstOrderDate) : undefined,
      lastOrderDate: input.summary.lastOrderDate ? new Date(input.summary.lastOrderDate) : undefined,
    };
  }
}
