import { PaymentType } from '@msk/mirza/shell/core/payment-type';

export class SalesDailyReport {
  date: Date;
  numberOfSales: number;
  totalDiscounts: number;
  totalSales: number;

  constructor(input: { date: string; numberOfSales: number; totalDiscounts: number; totalSales: number }) {
    const [year, month, day] = input.date.split('-').map(Number);
    this.date = new Date(year, month - 1, day);
    this.numberOfSales = input.numberOfSales;
    this.totalDiscounts = input.totalDiscounts;
    this.totalSales = input.totalSales;
  }
}

export class SalesPaymentTypeReport {
  paymentType: PaymentType;
  totalAmount: number;

  constructor(input: { paymentType: PaymentType; totalamount: number }) {
    this.paymentType = input.paymentType;
    this.totalAmount = input.totalamount;
  }
}
