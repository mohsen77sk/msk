import { MskSortable } from '@msk/shared/data-access';

export const DefaultPaymentTypeSortData: MskSortable = { active: 'title', direction: 'asc' };

export class PaymentType {
  id: number;
  code: string;
  title: string;
  isDefault: boolean;
  createdAt?: Date;

  constructor(input: Omit<PaymentType, 'createdAt' | 'isDefault'> & { isDefault?: boolean; createdAt?: Date | string }) {
    this.id = input.id;
    this.code = input.code;
    this.title = input.title;
    this.isDefault = input.isDefault ?? false;
    this.createdAt = input.createdAt ? new Date(input.createdAt) : undefined;
  }
}

export class PaymentTypeDetail {
  paymentType: number | string;
  value: number;

  constructor(input: Partial<PaymentTypeDetail>) {
    this.paymentType = input.paymentType || '';
    this.value = input.value || 0;
  }
}
