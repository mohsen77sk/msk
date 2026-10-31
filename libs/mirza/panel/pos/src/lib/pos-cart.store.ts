import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { StoreService } from '@msk/mirza/shell/core/store';
import { PaymentType } from '@msk/mirza/panel/payment-types';
import { ICreateSale } from '@msk/mirza/panel/sales';
import { PosCartLine, PosCartState, PosPaymentMode, PosProduct, PosQuickNote, PosSelectedCustomer } from './pos.types';

const STORAGE_KEY_PREFIX = 'mz-pos-cart:';

/**
 * State of the sale being entered at the POS. One per POS page.
 */
@Injectable()
export class PosCartStore {
  private _storageKey = `${STORAGE_KEY_PREFIX}${inject(StoreService).currentStore?.id ?? 0}`;

  // Cart
  readonly lines = signal<PosCartLine[]>([]);
  readonly selectedProductId = signal<number | null>(null);
  readonly customer = signal<PosSelectedCustomer | null>(null);
  readonly discountInput = signal(0);
  readonly note = signal('');

  // Payment
  readonly paymentTypes = signal<PaymentType[]>([]);
  readonly paymentMode = signal<PosPaymentMode>('single');
  readonly paymentTypeId = signal<number | null>(null);
  readonly splitValues = signal<Record<number, number>>({});

  readonly submitting = signal(false);

  // Derived
  readonly subtotal = computed(() => this.lines().reduce((sum, line) => sum + line.unitPrice * line.quantity, 0));
  readonly discount = computed(() => Math.min(Math.max(this.discountInput() || 0, 0), this.subtotal()));
  readonly total = computed(() => this.subtotal() - this.discount());
  readonly unitCount = computed(() => this.lines().reduce((sum, line) => sum + line.quantity, 0));
  readonly quantityByProduct = computed(() => new Map(this.lines().map((line) => [line.productId, line.quantity])));
  readonly selectedLine = computed(
    () => this.lines().find((line) => line.productId === this.selectedProductId()) ?? null,
  );
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
   * One line per product: +1 if present, otherwise a new line. The line becomes selected.
   * @param product
   */
  add(product: PosProduct): void {
    if (this.quantityByProduct().has(product.id)) {
      this._updateLine(product.id, (line) => ({ ...line, quantity: line.quantity + 1 }));
    } else {
      this.lines.update((lines) => [
        ...lines,
        { productId: product.id, name: product.name, unitPrice: product.sellPrice, quantity: 1, notes: [] },
      ]);
    }
    this.selectedProductId.set(product.id);
  }

  /**
   * Change a line's quantity by delta; 0 removes the line
   * @param productId
   * @param delta
   */
  changeQuantity(productId: number, delta: number): void {
    const line = this.lines().find((x) => x.productId === productId);
    if (line) this.setQuantity(productId, line.quantity + delta);
  }

  /**
   * Set a line's quantity; 0 removes the line
   * @param productId
   * @param quantity
   */
  setQuantity(productId: number, quantity: number): void {
    if (quantity > 0) {
      this._updateLine(productId, (line) => ({ ...line, quantity }));
      return;
    }

    const index = this.lines().findIndex((line) => line.productId === productId);
    if (index === -1) return;
    const lines = this.lines().filter((line) => line.productId !== productId);
    this.lines.set(lines);
    if (this.selectedProductId() === productId) {
      // Keep a selection near the removed line
      this.selectedProductId.set(lines[Math.min(index, lines.length - 1)]?.productId ?? null);
    }
  }

  /**
   * @param productId
   */
  select(productId: number): void {
    this.selectedProductId.set(productId);
  }

  /**
   * Move the selection up (-1) or down (+1) the cart
   * @param step
   */
  moveSelection(step: number): void {
    const lines = this.lines();
    if (!lines.length) return;
    const index = lines.findIndex((line) => line.productId === this.selectedProductId());
    const next =
      index === -1 ? (step > 0 ? 0 : lines.length - 1) : Math.min(Math.max(index + step, 0), lines.length - 1);
    this.selectedProductId.set(lines[next].productId);
  }

  /**
   * @param productId
   * @param note
   */
  toggleNote(productId: number, note: PosQuickNote): void {
    this._updateLine(productId, (line) => ({
      ...line,
      notes: line.notes.includes(note) ? line.notes.filter((x) => x !== note) : [...line.notes, note],
    }));
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
   * @param noteText line note keys -> text
   */
  toPayload(noteText: (notes: PosQuickNote[]) => string): ICreateSale {
    const saleItems = this.lines().map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      total: line.unitPrice * line.quantity,
      note: line.notes.length ? noteText(line.notes) : undefined,
    }));
    const total = saleItems.reduce((sum, item) => sum + item.total, 0) - this.discount();
    const paymentTypes =
      this.paymentMode() === 'split'
        ? this.paymentTypes()
            .map((paymentType) => ({ paymentTypeId: paymentType.id, value: this.splitValues()[paymentType.id] || 0 }))
            .filter((payment) => payment.value > 0)
        : [{ paymentTypeId: this.paymentTypeId() as number, value: total }];

    return {
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
    this.selectedProductId.set(null);
    this.customer.set(null);
    this.discountInput.set(0);
    this.note.set('');
    this.closeSplit();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _updateLine(productId: number, change: (line: PosCartLine) => PosCartLine): void {
    this.lines.update((lines) => lines.map((line) => (line.productId === productId ? change(line) : line)));
  }

  private _defaultPaymentTypeId(): number | null {
    const paymentTypes = this.paymentTypes();
    return (paymentTypes.find((paymentType) => paymentType.isDefault) ?? paymentTypes[0])?.id ?? null;
  }

  private _snapshot(): PosCartState {
    return {
      lines: this.lines(),
      selectedProductId: this.selectedProductId(),
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

    this.lines.set(state.lines);
    this.selectedProductId.set(state.selectedProductId ?? null);
    this.customer.set(state.customer ?? null);
    this.discountInput.set(state.discount ?? 0);
    this.note.set(state.note ?? '');
    this.paymentMode.set(state.paymentMode === 'split' ? 'split' : 'single');
    this.paymentTypeId.set(state.paymentTypeId ?? null);
    this.splitValues.set(state.splitValues ?? {});
  }
}
