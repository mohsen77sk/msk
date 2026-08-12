import { MskSortable } from '@msk/shared/data-access';

export const DefaultExpenseSortData: MskSortable = { active: 'date', direction: 'desc' };
export const DefaultExpenseCategorySortData: MskSortable = { active: 'name', direction: 'asc' };

export class ExpenseCategory {
  id: number;
  name: string;

  constructor(input: Partial<ExpenseCategory>) {
    this.id = input.id as number;
    this.name = input.name as string;
  }
}

export class Expense {
  id: number;
  number: number;
  cost: number;
  description: string;
  category?: ExpenseCategory;
  date: Date | null;
  createdAt?: Date;

  constructor(input: Partial<Expense>) {
    this.id = input.id as number;
    this.number = input.number as number;
    this.cost = input.cost ?? 0;
    this.description = input.description ?? '';
    this.category = input.category ? new ExpenseCategory(input.category) : undefined;
    this.date = input.date ? new Date(input.date) : null;
    this.createdAt = input.createdAt ? new Date(input.createdAt) : undefined;
  }
}

export interface ICreateExpense {
  id?: number;
  cost: number;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  date?: string;
}
