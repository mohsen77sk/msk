import { SortDirection } from '@angular/material/sort';
import { ProductCategory } from '@msk/mirza/panel/product-categories';

export const DefaultProductsSortId = 'name';
export const DefaultProductsSortDirection: SortDirection = 'asc';

export enum ProductUnit {
  PIECE = 'piece',
  GRAM = 'gram',
  KG = 'kg',
}

export class Product {
  id: number;
  name: string;
  unit: ProductUnit;
  quantity?: number;
  cost?: number;
  sellPrice?: number;
  category?: ProductCategory;
  note?: string;

  constructor(input: Product) {
    this.id = input.id;
    this.name = input.name;
    this.unit = input.unit;
    this.quantity = input.quantity;
    this.cost = input.cost;
    this.sellPrice = input.sellPrice;
    this.category = input.category ? new ProductCategory(input.category) : undefined;
    this.note = input.note;
  }
}

export interface ICreateProduct {
  id: number;
  name: string;
  categoryId: number;
  unit: string;
  quantity: number;
  cost: number;
  sellPrice: number;
  note: string;
}

export class ProductItem {
  productId: number;
  quantity: number;
  total: number;

  constructor(input: ProductItem) {
    this.productId = input.productId;
    this.quantity = input.quantity;
    this.total = input.total;
  }
}
