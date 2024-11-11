import { SortDirection } from '@angular/material/sort';

export const DefaultAccountSortId = 'code';
export const DefaultAccountSortDirection: SortDirection = 'asc';

export interface ICreateAccount {
  accountTypeId: number;
  initCredit: number;
  createDate: Date;
  personId: number[];
  note?: string;
}

export interface IUpdateAccount {
  id: number;
  personId?: number[];
  note?: string;
}

export interface ICloseAccount {
  id: number;
  closeDate: Date;
}

export interface IBalanceAccount {
  id: number;
  balance: number;
}

export class Account {
  id: number;
  code: string;
  accountTypeId: number;
  accountTypeName: string;
  createDate: Date;
  closeDate?: Date;
  balance?: number;
  persons: AccountPeople[];
  note?: string;
  isActive: boolean;

  constructor(input: Account) {
    this.id = input.id;
    this.code = input.code;
    this.accountTypeId = input.accountTypeId;
    this.accountTypeName = input.accountTypeName;
    this.createDate = new Date(input.createDate);
    this.closeDate = input.closeDate ? new Date(input.closeDate) : undefined;
    this.balance = input.balance;
    this.persons = input.persons?.map((ap) => new AccountPeople(ap));
    this.note = input.note;
    this.isActive = input.isActive;
  }

  get fullName(): string {
    return this.accountTypeName + ' ' + this.persons.map((p) => p.name).join('/');
  }
}

export class AccountPeople {
  id: number;
  code: string;
  name: string;

  constructor(input: AccountPeople) {
    this.id = input.id;
    this.code = input.code;
    this.name = input.name;
  }
}
