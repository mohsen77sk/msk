import type { ProductUnit } from '@msk/mirza/panel/products';

export class PublicMenuProduct {
  id: number;
  name: string;
  sellPrice: number;
  // Type-only use of the enum keeps the products feature out of this public bundle
  unit: `${ProductUnit}`;

  constructor(input: PublicMenuProduct) {
    this.id = input.id;
    this.name = input.name;
    this.sellPrice = input.sellPrice;
    this.unit = input.unit;
  }
}

export class PublicMenuSection {
  // null for products without a category
  id: number | null;
  name: string | null;
  products: PublicMenuProduct[];

  constructor(input: PublicMenuSection) {
    this.id = input.id;
    this.name = input.name;
    this.products = input.products.map((product) => new PublicMenuProduct(product));
  }
}

export class PublicMenu {
  slug: string;
  store: {
    name: string;
    logoUrl: string | null;
  };
  categories: PublicMenuSection[];

  constructor(input: PublicMenu) {
    this.slug = input.slug;
    this.store = { name: input.store.name, logoUrl: input.store.logoUrl };
    this.categories = input.categories.map((section) => new PublicMenuSection(section));
  }
}
