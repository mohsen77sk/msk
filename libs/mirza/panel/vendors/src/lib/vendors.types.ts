import { SortDirection } from '@angular/material/sort';
import { GenderEnum } from '@msk/mirza/panel/customers';

export const DefaultVendorsSortId = 'name';
export const DefaultVendorsSortDirection: SortDirection = 'asc';

export class Vendor {
  id: string;
  name: string;
  gender: GenderEnum;
  contactNumber?: string;
  address?: string;
  note?: string;

  constructor(input: Vendor) {
    this.id = input.id;
    this.name = input.name;
    this.gender = input.gender;
    this.contactNumber = input.contactNumber;
    this.address = input.address;
    this.note = input.note;
  }
}
