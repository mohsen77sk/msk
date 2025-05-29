import { SortDirection } from '@angular/material/sort';

export const DefaultCustomersSortId = 'name';
export const DefaultCustomersSortDirection: SortDirection = 'asc';

export enum GenderEnum {
  male = 'male',
  female = 'female',
  company = 'company',
}

export class Customer {
  id: string;
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
