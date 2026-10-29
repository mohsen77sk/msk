import { MskSortable } from '@msk/shared/data-access';
import { ProductCategory } from '@msk/mirza/panel/product-categories';

export const DefaultProductsSortData: MskSortable = { active: 'name', direction: 'asc' };

export type ProductPurpose = 'sale' | 'purchase' | 'ingredient';

export enum ProductUnit {
  PIECE = 'piece',
  GRAM = 'gram',
  KG = 'kg',
  ML = 'ml',
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
  isSellable: boolean;
  isPurchasable: boolean;
  // Recipe-derived cost (null if an ingredient has no cost), else the manual cost
  effectiveCost?: number | null;
  hasRecipe: boolean;

  constructor(input: Product) {
    this.id = input.id;
    this.name = input.name;
    this.unit = input.unit;
    this.quantity = input.quantity;
    this.cost = input.cost;
    this.sellPrice = input.sellPrice;
    this.category = input.category ? new ProductCategory(input.category) : undefined;
    this.note = input.note;
    this.isSellable = input.isSellable ?? true;
    this.isPurchasable = input.isPurchasable ?? true;
    this.effectiveCost = input.effectiveCost;
    this.hasRecipe = input.hasRecipe ?? false;
  }
}

export interface ProductRecipeIngredient {
  id: number;
  name: string;
  unit: ProductUnit;
  effectiveCost?: number | null;
}

export interface ProductRecipeLine {
  ingredient: ProductRecipeIngredient;
  quantity: number;
  // Percent of the input lost in preparation; effectiveQuantity includes it
  wastePercent: number;
  effectiveQuantity: number;
  lineCost: number | null;
}

export interface ProductRecipe {
  items: ProductRecipeLine[];
  cost: number | null;
  costComplete: boolean;
}

export interface IRecipeItem {
  ingredientId: number;
  quantity: number;
  wastePercent?: number;
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
  isSellable: boolean;
  isPurchasable: boolean;
  // Omitted = recipe unchanged, [] = recipe cleared
  recipeItems?: IRecipeItem[];
}

export class ProductItem {
  product?: Product;
  productId: number;
  quantity: number;
  total: number;

  constructor(input: ProductItem) {
    this.product = input.product ? new Product(input.product) : undefined;
    this.productId = input.productId;
    this.quantity = input.quantity;
    this.total = input.total;
  }
}
