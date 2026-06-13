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
  paymentType: string;
  totalAmount: number;

  constructor(input: { paymentType: string; totalamount: number | string }) {
    this.paymentType = input.paymentType;
    this.totalAmount = Number(input.totalamount);
  }
}
