/**
 * A store's quick-note chip (POS, sale dialog). Sale lines store the note text, not the quick note.
 */
export class QuickNote {
  id: number;
  label: string;
  sortOrder: number;
  isActive: boolean;
  // Empty = all products
  categoryIds: number[];

  constructor(input: Partial<QuickNote>) {
    this.id = input.id ?? 0;
    this.label = input.label ?? '';
    this.sortOrder = input.sortOrder ?? 0;
    this.isActive = input.isActive ?? true;
    this.categoryIds = input.categoryIds ?? [];
  }
}

export interface ISaveQuickNote {
  id?: number;
  label: string;
  isActive: boolean;
  categoryIds: number[];
}

// quick_note.label is varchar(64)
export const QUICK_NOTE_LABEL_MAX_LENGTH = 64;
// sale-item.note is varchar(255)
export const SALE_LINE_NOTE_MAX_LENGTH = 255;
/**
 * Joins the parts of a sale line note. One fixed separator, whatever the UI language, so the
 * sale dialog can find the POS's parts again.
 */
export const SALE_LINE_NOTE_SEPARATOR = '، ';

/**
 * Whether a quick note is offered for a product of this category
 * @param note
 * @param categoryId the product's category; null/undefined = no category
 */
export function quickNoteApplies(note: QuickNote, categoryId: number | null | undefined): boolean {
  return !note.categoryIds.length || (categoryId != null && note.categoryIds.includes(categoryId));
}

/**
 * Parts of a sale line note, as joined by joinSaleLineNote
 * @param note
 */
export function splitSaleLineNote(note: string | null | undefined): string[] {
  return (note ?? '')
    .split(SALE_LINE_NOTE_SEPARATOR.trim())
    .map((part) => part.trim())
    .filter((part) => !!part);
}

/**
 * @param parts
 */
export function joinSaleLineNote(parts: string[]): string {
  return parts.join(SALE_LINE_NOTE_SEPARATOR);
}
