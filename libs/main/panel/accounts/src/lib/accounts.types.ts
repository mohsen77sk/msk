import { SortDirection } from '@angular/material/sort';

export const DefaultAccountSortId = 'code';
export const DefaultAccountSortDirection: SortDirection = 'asc';

export class Account {
  id: number;
  code: string;
  accountTypeId: number;
  accountTypeName: string;
  createDate: Date;
  closeDate?: Date;
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
    this.persons = input.persons?.map((ap) => new AccountPeople(ap));
    this.note = input.note;
    this.isActive = input.isActive;
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
