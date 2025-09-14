import { MskSortable } from '@msk/shared/data-access';

export const DefaultProductCategorySortData: MskSortable = { active: 'name', direction: 'asc' };
export class ProductCategory {
  id: number;
  name: string;
  note?: string;

  constructor(input: ProductCategory) {
    this.id = input.id;
    this.name = input.name;
    this.note = input.note;
  }
}
