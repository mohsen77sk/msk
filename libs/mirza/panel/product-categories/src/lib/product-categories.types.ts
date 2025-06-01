import { SortDirection } from '@angular/material/sort';

export const DefaultProductCategoriesSortId = 'name';
export const DefaultProductCategoriesSortDirection: SortDirection = 'asc';

export class ProductCategory {
  id: string;
  name: string;
  note?: string;

  constructor(input: ProductCategory) {
    this.id = input.id;
    this.name = input.name;
    this.note = input.note;
  }
}
