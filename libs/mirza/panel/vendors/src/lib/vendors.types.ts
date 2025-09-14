import { MskSortable } from '@msk/shared/data-access';
import { GenderEnum } from '@msk/mirza/panel/customers';

export const DefaultVendorsSortData: MskSortable = { active: 'name', direction: 'asc' };

export class Vendor {
  id: number;
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
