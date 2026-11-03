/**
 * What a member may do in the current store. Mirrors STORE_PERMISSIONS in
 * mirza/src/store/store-permissions.ts; keep both in sync.
 */
export const STORE_PERMISSIONS = [
  'sales.create',
  'sales.view_all',
  'sales.edit',
  'sales.delete',
  'customers.manage',
  'products.manage',
  'purchases.manage',
  'vendors.manage',
  'expenses.manage',
  'reports.view',
  'settings.manage',
  'members.manage',
] as const;

export type StorePermission = (typeof STORE_PERMISSIONS)[number];

// The 4 roles every store starts with; roles a store adds itself have key null
export type StoreRoleKey = 'owner' | 'manager' | 'cashier' | 'storekeeper';

export interface StoreAccess {
  role: { id: number; key: StoreRoleKey | null; name: string };
  permissions: StorePermission[];
}

/**
 * The permission each panel page needs (by its link). Pages not listed are open to every member.
 */
export const PAGE_PERMISSIONS: Record<string, StorePermission> = {
  '/panel/dashboard': 'reports.view',
  '/panel/vendors': 'vendors.manage',
  '/panel/product-categories': 'products.manage',
  '/panel/products': 'products.manage',
  '/panel/payment-types': 'settings.manage',
  '/panel/quick-notes': 'settings.manage',
  '/panel/purchases': 'purchases.manage',
  '/panel/expenses': 'expenses.manage',
  '/panel/settings': 'settings.manage',
  '/panel/members': 'members.manage',
  '/pos': 'sales.create',
};
