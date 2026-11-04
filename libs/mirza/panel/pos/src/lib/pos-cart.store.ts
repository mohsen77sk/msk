import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { StoreService } from '@msk/mirza/shell/core/store';
import { PaymentType } from '@msk/mirza/panel/payment-types';
import { ICreateSale } from '@msk/mirza/panel/sales';
import { SALE_LINE_NOTE_MAX_LENGTH, joinSaleLineNote } from '@msk/mirza/panel/quick-notes';
import {
  LEGACY_POS_QUICK_NOTE_LABELS,
  PosCartLine,
  PosCartState,
  PosPaymentMode,
  PosProduct,
  PosSelectedCustomer,
  samePosNotes,
} from './pos.types';

const STORAGE_KEY_PREFIX = 'mz-pos-cart:';

/**
 * State of the sale being entered at the POS. One per POS page.
 */
@Injectable()
export class PosCartStore {
  private _storageKey = `${STORAGE_KEY_PREFIX}${inject(StoreService).currentStore?.id ?? 0}`;

  // Cart
  readonly lines = signal<PosCartLine[]>([]);
  readonly selectedLineId = signal<number | null>(null);
  readonly customer = signal<PosSelectedCustomer | null>(null);
  readonly discountInput = signal(0);
  readonly note = signal('');

  // Payment
  readonly paymentTypes = signal<PaymentType[]>([]);
  readonly paymentMode = signal<PosPaymentMode>('single');
  readonly paymentTypeId = signal<number | null>(null);
  readonly splitValues = signal<Record<number, number>>({});

  readonly submitting = signal(false);

  private _lastLineId = 0;

  // Derived
  readonly subtotal = computed(() => this.lines().reduce((sum, line) => sum + line.unitPrice * line.quantity, 0));
  readonly discount = computed(() => Math.min(Math.max(this.discountInput() || 0, 0), this.subtotal()));
  readonly total = computed(() => this.subtotal() - this.discount());
  readonly unitCount = computed(() => this.lines().reduce((sum, line) => sum + line.quantity, 0));
  // All lines of a product together
  readonly quantityByProduct = computed(() => {
    const quantities = new Map<number, number>();
    for (const line of this.lines()) {
      quantities.set(line.productId, (quantities.get(line.productId) ?? 0) + line.quantity);
    }
    return quantities;
  });
  readonly selectedLine = computed(() => this.lines().find((line) => line.id === this.selectedLineId()) ?? null);
  readonly selectedPaymentType = computed(
    () => this.paymentTypes().find((paymentType) => paymentType.id === this.paymentTypeId()) ?? null,
  );
  readonly splitPaid = computed(() =>
    this.paymentTypes().reduce((sum, paymentType) => sum + (this.splitValues()[paymentType.id] || 0), 0),
  );
  // > 0: still to pay, < 0: paid too much
  readonly splitRemaining = computed(() => this.total() - this.splitPaid());
  readonly canSubmit = computed(() => {
    if (!this.lines().length || this.submitting()) return false;
    if (this.paymentMode() === 'split') return Math.round(this.splitRemaining()) === 0;
    return this.selectedPaymentType() !== null;
  });

  /**
   * Constructor
   */
  constructor() {
    this._restore();
    effect(() => this._save(this._snapshot()));
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lines
  // -----------------------------------------------------------------------------------------------------

  /**
   * +1 on the product's line without notes, otherwise a new plain line. The line becomes selected.
   * @param product
   */
  add(product: PosProduct): void {
    const plain = this.lines().find((line) => line.productId === product.id && !line.notes.length);
    if (plain) {
      this._updateLine(plain.id, (line) => ({ ...line, quantity: line.quantity + 1 }));
      this.selectedLineId.set(plain.id);
      return;
    }

    const id = this._nextLineId();
    this.lines.update((lines) => [
      ...lines,
      { id, productId: product.id, name: product.name, unitPrice: product.sellPrice, quantity: 1, notes: [] },
    ]);
    this.selectedLineId.set(id);
  }

  /**
   * Change a line's quantity by delta; 0 removes the line
   * @param lineId
   * @param delta
   */
  changeQuantity(lineId: number, delta: number): void {
    const line = this.lines().find((x) => x.id === lineId);
    if (line) this.setQuantity(lineId, line.quantity + delta);
  }

  /**
   * Set a line's quantity; 0 removes the line
   * @param lineId
   * @param quantity
   */
  setQuantity(lineId: number, quantity: number): void {
    if (quantity > 0) {
      this._updateLine(lineId, (line) => ({ ...line, quantity }));
      return;
    }

    const index = this.lines().findIndex((line) => line.id === lineId);
    if (index === -1) return;
    const lines = this.lines().filter((line) => line.id !== lineId);
    this.lines.set(lines);
    if (this.selectedLineId() === lineId) {
      // Keep a selection near the removed line
      this.selectedLineId.set(lines[Math.min(index, lines.length - 1)]?.id ?? null);
    }
  }

  /**
   * @param lineId
   */
  select(lineId: number): void {
    this.selectedLineId.set(lineId);
  }

  /**
   * Move the selection up (-1) or down (+1) the cart
   * @param step
   */
  moveSelection(step: number): void {
    const lines = this.lines();
    if (!lines.length) return;
    const index = lines.findIndex((line) => line.id === this.selectedLineId());
    const next =
      index === -1 ? (step > 0 ? 0 : lines.length - 1) : Math.min(Math.max(index + step, 0), lines.length - 1);
    this.selectedLineId.set(lines[next].id);
  }

  /**
   * Toggle a quick note on one line
   * @param lineId
   * @param note
   */
  toggleNote(lineId: number, note: string): void {
    const line = this.lines().find((x) => x.id === lineId);
    if (!line) return;
    if (line.notes.includes(note)) {
      this._setNotes(
        lineId,
        line.notes.filter((x) => x !== note),
      );
    } else if (this.fitsNote(line, note)) {
      this._setNotes(lineId, [...line.notes, note]);
    }
  }

  /**
   * Add free text to one line's notes; it joins the same note set as the quick notes
   * @param lineId
   * @param text
   * @returns false if it doesn't fit in the line note
   */
  addNote(lineId: number, text: string): boolean {
    const note = text.trim();
    const line = this.lines().find((x) => x.id === lineId);
    if (!line || !note) return !!line;
    if (line.notes.includes(note)) return true;
    if (!this.fitsNote(line, note)) return false;

    this._setNotes(lineId, [...line.notes, note]);
    return true;
  }

  /**
   * Whether the line note stays within the sale line limit with this part added
   * @param line
   * @param note
   */
  fitsNote(line: PosCartLine, note: string): boolean {
    return joinSaleLineNote([...line.notes, note.trim()]).length <= SALE_LINE_NOTE_MAX_LENGTH;
  }

  /**
   * Move one unit into a new line right below with the same notes; the new line becomes selected
   * @param lineId
   */
  splitOne(lineId: number): void {
    const lines = this.lines();
    const index = lines.findIndex((line) => line.id === lineId);
    const line = lines[index];
    if (!line || line.quantity < 2) return;

    const id = this._nextLineId();
    this.lines.set([
      ...lines.slice(0, index),
      { ...line, quantity: line.quantity - 1 },
      { ...line, id, quantity: 1, notes: [...line.notes] },
      ...lines.slice(index + 1),
    ]);
    this.selectedLineId.set(id);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Payment
  // -----------------------------------------------------------------------------------------------------

  /**
   * Payment types of the store; keeps a restored choice if it still exists, else the default
   * @param paymentTypes
   */
  setPaymentTypes(paymentTypes: PaymentType[]): void {
    this.paymentTypes.set(paymentTypes);
    if (!paymentTypes.some((paymentType) => paymentType.id === this.paymentTypeId())) {
      this.paymentTypeId.set(this._defaultPaymentTypeId());
    }
  }

  /**
   * Split mode starts with the whole amount on the previously selected type
   */
  openSplit(): void {
    const paymentTypeId = this.paymentTypeId() ?? this._defaultPaymentTypeId();
    this.splitValues.set(paymentTypeId ? { [paymentTypeId]: this.total() } : {});
    this.paymentMode.set('split');
  }

  closeSplit(): void {
    this.paymentMode.set('single');
    this.splitValues.set({});
  }

  /**
   * @param paymentTypeId
   * @param value
   */
  setSplitValue(paymentTypeId: number, value: number | null): void {
    this.splitValues.update((values) => ({ ...values, [paymentTypeId]: Math.max(value ?? 0, 0) }));
  }

  /**
   * Put whatever is still unpaid on this row
   * @param paymentTypeId
   */
  fillRemaining(paymentTypeId: number): void {
    const others = this.splitPaid() - (this.splitValues()[paymentTypeId] || 0);
    this.setSplitValue(paymentTypeId, this.total() - others);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Sale
  // -----------------------------------------------------------------------------------------------------

  /**
   * POST /sale payload
   */
  toPayload(): ICreateSale {
    const saleItems = this.lines().map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      total: line.unitPrice * line.quantity,
      note: line.notes.length ? joinSaleLineNote(line.notes) : undefined,
    }));
    const total = saleItems.reduce((sum, item) => sum + item.total, 0) - this.discount();
    const paymentTypes =
      this.paymentMode() === 'split'
        ? this.paymentTypes()
            .map((paymentType) => ({ paymentTypeId: paymentType.id, value: this.splitValues()[paymentType.id] || 0 }))
            .filter((payment) => payment.value > 0)
        : [{ paymentTypeId: this.paymentTypeId() as number, value: total }];

    return {
      source: 'pos',
      customerId: this.customer()?.id,
      saleItems,
      discount: this.discount(),
      note: this.note().trim() || undefined,
      paymentTypes,
      total,
    };
  }

  /**
   * Empty the cart; the payment type choice stays
   */
  clear(): void {
    this.lines.set([]);
    this.selectedLineId.set(null);
    this.customer.set(null);
    this.discountInput.set(0);
    this.note.set('');
    this.closeSplit();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _updateLine(lineId: number, change: (line: PosCartLine) => PosCartLine): void {
    this.lines.update((lines) => lines.map((line) => (line.id === lineId ? change(line) : line)));
  }

  /**
   * Set a line's notes. If another line of the product then has the same notes, the two merge
   * into the earlier one, which becomes selected.
   * @param lineId
   * @param notes
   */
  private _setNotes(lineId: number, notes: string[]): void {
    const lines = this.lines();
    const index = lines.findIndex((line) => line.id === lineId);
    if (index === -1) return;
    const line = lines[index];

    const twinIndex = lines.findIndex(
      (x) => x.id !== lineId && x.productId === line.productId && samePosNotes(x.notes, notes),
    );
    if (twinIndex === -1) {
      this._updateLine(lineId, (x) => ({ ...x, notes }));
      return;
    }

    const [keep, drop] = twinIndex < index ? [lines[twinIndex], line] : [{ ...line, notes }, lines[twinIndex]];
    this.lines.set(
      lines
        .filter((x) => x.id !== drop.id)
        .map((x) => (x.id === keep.id ? { ...keep, quantity: keep.quantity + drop.quantity } : x)),
    );
    this.selectedLineId.set(keep.id);
  }

  private _nextLineId(): number {
    return ++this._lastLineId;
  }

  private _defaultPaymentTypeId(): number | null {
    const paymentTypes = this.paymentTypes();
    return (paymentTypes.find((paymentType) => paymentType.isDefault) ?? paymentTypes[0])?.id ?? null;
  }

  private _snapshot(): PosCartState {
    return {
      lines: this.lines(),
      selectedLineId: this.selectedLineId(),
      customer: this.customer(),
      discount: this.discountInput(),
      note: this.note(),
      paymentMode: this.paymentMode(),
      paymentTypeId: this.paymentTypeId(),
      splitValues: this.splitValues(),
    };
  }

  private _save(state: PosCartState): void {
    try {
      sessionStorage.setItem(this._storageKey, JSON.stringify(state));
    } catch {
      // Storage unavailable (private mode, quota): the cart just isn't kept across a refresh
    }
  }

  private _restore(): void {
    let state: Partial<PosCartState> | null = null;
    try {
      state = JSON.parse(sessionStorage.getItem(this._storageKey) ?? 'null');
    } catch {
      return;
    }
    if (!state || !Array.isArray(state.lines)) return;

    // Carts saved before lines had ids get fresh ones; old quick-note keys become labels
    const lines = state.lines.map((line) => ({
      ...line,
      id: Number.isInteger(line.id) ? line.id : 0,
      notes: (line.notes ?? []).map((note) => LEGACY_POS_QUICK_NOTE_LABELS[note] ?? note),
    }));
    this._lastLineId = Math.max(0, ...lines.map((line) => line.id));
    this.lines.set(lines.map((line) => (line.id ? line : { ...line, id: this._nextLineId() })));
    const selectedLineId = state.selectedLineId ?? null;
    this.selectedLineId.set(this.lines().some((line) => line.id === selectedLineId) ? selectedLineId : null);
    this.customer.set(state.customer ?? null);
    this.discountInput.set(state.discount ?? 0);
    this.note.set(state.note ?? '');
    this.paymentMode.set(state.paymentMode === 'split' ? 'split' : 'single');
    this.paymentTypeId.set(state.paymentTypeId ?? null);
    this.splitValues.set(state.splitValues ?? {});
  }
}
