export interface CreateStoreRequest {
  name: string;
}

export interface UpdateStoreRequest {
  name?: string;
  status?: boolean;
  phone?: string;
  postalCode?: string;
  economicCode?: string;
  nationalId?: string;
  address?: string;
}

export interface IStoreResponse {
  id: number;
  name: string;
  status?: boolean;
  logoUrl?: string | null;
  phone?: string | null;
  postalCode?: string | null;
  economicCode?: string | null;
  nationalId?: string | null;
  address?: string | null;
}

export class Store {
  id: number;
  name: string;
  isActive: boolean;
  logoUrl?: string;
  phone?: string;
  postalCode?: string;
  economicCode?: string;
  nationalId?: string;
  address?: string;

  constructor(input: IStoreResponse) {
    this.id = input.id;
    this.name = input.name;
    this.isActive = input.status ?? false;
    this.logoUrl = input.logoUrl ?? undefined;
    this.phone = input.phone ?? undefined;
    this.postalCode = input.postalCode ?? undefined;
    this.economicCode = input.economicCode ?? undefined;
    this.nationalId = input.nationalId ?? undefined;
    this.address = input.address ?? undefined;
  }
}
