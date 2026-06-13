import { MskSortable } from '@msk/shared/data-access';

export const DefaultPaymentTypeSortData: MskSortable = { active: 'name', direction: 'asc' };
export class PaymentType {
  id: number;
  name: string;
  isDefault: boolean;

  constructor(input: PaymentType & { title?: string }) {
    this.id = input.id;
    this.name = input.name ?? input.title;
    this.isDefault = input.isDefault ?? false;
  }
}

export class PaymentTypeDetail {
  id?: number;
  paymentType?: PaymentType;
  paymentTypeId: number;
  value: number;

  constructor(input: Partial<PaymentTypeDetail>) {
    this.id = input.id;
    this.paymentType = input.paymentType ? new PaymentType(input.paymentType) : undefined;
    this.paymentTypeId = input.paymentTypeId || this.paymentType?.id || 0;
    this.value = input.value || 0;
  }
}
