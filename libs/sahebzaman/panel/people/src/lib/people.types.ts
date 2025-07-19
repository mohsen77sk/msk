import { SortDirection } from '@angular/material/sort';

export const DefaultPeopleSortId = 'code';
export const DefaultPeopleSortDirection: SortDirection = 'asc';

export enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
}

export class Person {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  birthday?: Date;
  gender: Gender;
  note?: string;
  isActive: boolean;

  constructor(input: Person) {
    this.id = input.id;
    this.code = input.code;
    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.nationalCode = input.nationalCode;
    this.birthday = input.birthday ? new Date(input.birthday) : undefined;
    this.gender = input.gender;
    this.note = input.note;
    this.isActive = input.isActive;
  }

  get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }
}
