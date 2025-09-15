export type MskChangeEvent<T> =
  | { type: 'create'; item: T }
  | { type: 'update'; item: T }
  | { type: 'delete'; id: number | string };
