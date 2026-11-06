import { StorePermission, StoreRoleKey } from '@msk/mirza/shell/core/store';

export interface StoreMemberRole {
  id: number;
  key: StoreRoleKey | null;
  name: string;
}

/**
 * A user's membership in the current store (GET /store-member)
 */
export class StoreMember {
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: StoreMemberRole;

  constructor(input: StoreMember) {
    this.userId = input.userId;
    this.firstName = input.firstName ?? '';
    this.lastName = input.lastName ?? '';
    this.phoneNumber = input.phoneNumber;
    this.role = input.role;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}

/**
 * A role of the current store (GET /store-role). The owner role always has every permission.
 */
export class StoreRole {
  id: number;
  key: StoreRoleKey | null;
  name: string;
  permissions: StorePermission[];
  memberCount: number;

  constructor(input: StoreRole) {
    this.id = input.id;
    this.key = input.key;
    this.name = input.name;
    this.permissions = input.permissions ?? [];
    this.memberCount = input.memberCount ?? 0;
  }

  get isOwner(): boolean {
    return this.key === 'owner';
  }
}

export interface IAddStoreMember {
  phone: string;
  roleId: number;
  firstName?: string;
  lastName?: string;
}

export interface ISaveStoreRole {
  name: string;
  permissions: StorePermission[];
}

// store_role.name is varchar(64)
export const STORE_ROLE_NAME_MAX_LENGTH = 64;
