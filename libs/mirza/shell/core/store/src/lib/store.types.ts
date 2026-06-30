export interface IStoreResponse {
  id: number;
  name: string;
  status?: boolean;
  logoUrl?: string | null;
}

export interface CreateStoreRequest {
  name: string;
}

export interface UpdateStoreRequest {
  name?: string;
}

export class Store {
  id: number;
  name: string;
  isActive: boolean;
  logoUrl?: string;

  constructor(input: IStoreResponse) {
    this.id = input.id;
    this.name = input.name;
    this.isActive = input.status ?? false;
    this.logoUrl = input.logoUrl ?? undefined;
  }
}
