export interface IStoreResponse {
  id: number;
  name: string;
  status?: boolean;
  logoUrl?: string | null;
}

export class Store {
  id: number;
  name: string;
  isActive: boolean;
  logoUrl: string | null;

  constructor(input: IStoreResponse) {
    this.id = input.id;
    this.name = input.name;
    this.isActive = input.status ?? false;
    this.logoUrl = input.logoUrl ?? null;
  }
}
