import { ProductCategory } from '@msk/mirza/panel/product-categories';
import { Product } from '@msk/mirza/panel/products';

// Mirrors the backend slug rules in mirza/src/menu/menu-slug.ts; keep both in sync.
export const MENU_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MENU_SLUG_MIN_LENGTH = 3;
export const MENU_SLUG_MAX_LENGTH = 50;
export const RESERVED_MENU_SLUGS = [
  'admin',
  'administrator',
  'api',
  'app',
  'assets',
  'auth',
  'cafemirza',
  'dashboard',
  'forgot-password',
  'help',
  'internal-server-error',
  'login',
  'logout',
  'maintenance',
  'menu',
  'menus',
  'mirza',
  'not-found',
  'official',
  'onboarding',
  'panel',
  'public',
  'register',
  'root',
  'settings',
  'sign-in',
  'sign-out',
  'sign-up',
  'signed-in-redirect',
  'signin',
  'signup',
  'support',
  'system',
  'www',
];

export interface IMenuConfigResponse {
  enabled: boolean;
  slug: string | null;
  // Ordered; only id, name, sellPrice, unit and category are returned
  products: Product[];
}

export class MenuConfig {
  enabled: boolean;
  slug: string | null;
  products: Product[];

  constructor(input: IMenuConfigResponse) {
    this.enabled = input.enabled;
    this.slug = input.slug;
    this.products = input.products.map((product) => new Product(product));
  }
}

export interface UpdateMenuRequest {
  enabled: boolean;
  slug: string;
}

export interface MenuProductGroup {
  category?: ProductCategory;
  products: Product[];
}
