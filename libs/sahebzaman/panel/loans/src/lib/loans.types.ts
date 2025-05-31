import { SortDirection } from '@angular/material/sort';

export const DefaultLoanSortId = 'code';
export const DefaultLoanSortDirection: SortDirection = 'asc';

export interface ICreateLoan {
  accountId: number;
  loanTypeId: number;
  createDate: Date;
  amount: number;
  installmentCount: number;
  installmentInterval: number;
  interestRates: number;
  note?: string;
}

export interface IUpdateLoan {
  id: number;
  accountId: number;
  note?: string;
}

export class Loan {
  id: number;
  code: string;
  accountId: number;
  accountCode: string;
  loanTypeId: number;
  loanTypeName: string;
  createDate: Date;
  closeDate?: Date;
  amount: number;
  installmentAmount: number;
  installmentCount: number;
  installmentInterval: number;
  interestRates: number;
  note?: string;
  isActive: boolean;

  constructor(input: Loan) {
    this.id = input.id;
    this.code = input.code;
    this.accountId = input.accountId;
    this.accountCode = input.accountCode;
    this.loanTypeId = input.loanTypeId;
    this.loanTypeName = input.loanTypeName;
    this.createDate = new Date(input.createDate);
    this.closeDate = input.closeDate ? new Date(input.closeDate) : undefined;
    this.amount = input.amount;
    this.installmentAmount = input.installmentAmount;
    this.installmentCount = input.installmentCount;
    this.installmentInterval = input.installmentInterval;
    this.interestRates = input.interestRates;
    this.note = input.note;
    this.isActive = input.isActive;
  }
}
