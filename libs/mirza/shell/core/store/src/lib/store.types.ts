export interface IStoreResponse {
  id: number;
  name: string;
  status?: boolean;
}

export class Store {
  id: number;
  name: string;
  isActive: boolean;

  constructor(input: IStoreResponse) {
    this.id = input.id;
    this.name = input.name;
    this.isActive = input.status ?? false;
  }
}
