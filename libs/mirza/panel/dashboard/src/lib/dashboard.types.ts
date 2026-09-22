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

export class TopProductReport {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;

  constructor(input: {
    productId: number;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
  }) {
    this.productId = input.productId;
    this.productName = input.productName;
    this.totalQuantitySold = input.totalQuantitySold;
    this.totalRevenue = input.totalRevenue;
  }
}

export class TopCategoryReport {
  categoryId: number;
  categoryName: string;
  totalQuantitySold: number;
  totalRevenue: number;

  constructor(input: {
    categoryId: number;
    categoryName: string;
    totalQuantitySold: number;
    totalRevenue: number;
  }) {
    this.categoryId = input.categoryId;
    this.categoryName = input.categoryName;
    this.totalQuantitySold = input.totalQuantitySold;
    this.totalRevenue = input.totalRevenue;
  }
}

export class TopCustomerReport {
  customerId: number;
  customerName: string;
  totalSales: number;

  constructor(input: { customerId: number; customerName: string; totalSales: number }) {
    this.customerId = input.customerId;
    this.customerName = input.customerName;
    this.totalSales = input.totalSales;
  }
}
