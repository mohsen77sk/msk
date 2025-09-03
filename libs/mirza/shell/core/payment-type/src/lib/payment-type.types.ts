export enum PaymentType {
  POSE = 'pose',
  CASH = 'cash',
  BANK_TRANSFER = 'bankTransfer',
  CHECKS = 'checks',
  GIFT = 'gift',
  NOT_PAID = 'notPaid',
}

export class PaymentTypeDetail {
  paymentType: PaymentType;
  value: number;

  constructor(input: Partial<PaymentTypeDetail>) {
    this.paymentType = input.paymentType || PaymentType.NOT_PAID;
    this.value = input.value || 0;
  }
}
