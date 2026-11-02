import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { QuickNote, QuickNotesService, joinSaleLineNote, quickNoteApplies } from '@msk/mirza/panel/quick-notes';
import { catchError, of } from 'rxjs';
import { PosCartStore } from '../pos-cart.store';
import { PosCartLine } from '../pos.types';

@Component({
  selector: 'mz-pos-cart',
  templateUrl: './pos-cart.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule, MatRippleModule, TranslocoDirective, MskCurrencyPipe],
})
export class PosCartComponent {
  private _translocoService = inject(TranslocoService);
  private _confirmationService = inject(MskConfirmationService);
  private _quickNotesService = inject(QuickNotesService);
  readonly cart = inject(PosCartStore);

  // Product id -> category id, from the catalog
  readonly categoryIdByProduct = input<Map<number, number | null>>(new Map());

  // The store's active quick notes, in chip order; without them only "دیگر…" is offered
  private _quickNotes = toSignal(
    this._quickNotesService.getQuickNotes(true).pipe(catchError(() => of([] as QuickNote[]))),
    { initialValue: [] as QuickNote[] },
  );

  // Line whose free-text note input is open
  readonly otherNoteLineId = signal<number | null>(null);
  readonly otherNoteTooLong = signal(false);
  private _otherNoteInput = viewChild<ElementRef<HTMLInputElement>>('otherNoteInput');

  // Focus goes back to the code input after a dialog closes
  readonly cleared = output<void>();

  private _list = viewChild<ElementRef<HTMLElement>>('lineList');

  /**
   * Constructor
   */
  constructor() {
    // Keep the selected line visible (keyboard selection, new lines)
    effect(() => {
      const lineId = this.cart.selectedLineId();
      const list = this._list()?.nativeElement;
      if (lineId === null || !list) return;
      queueMicrotask(() => list.querySelector(`[data-line-id="${lineId}"]`)?.scrollIntoView({ block: 'nearest' }));
    });

    // The free-text input belongs to the selected line
    effect(() => {
      if (this.otherNoteLineId() !== null && this.otherNoteLineId() !== this.cart.selectedLineId()) {
        this.closeOtherNote();
      }
    });

    effect(() => this._otherNoteInput()?.nativeElement.focus());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * @param notes
   */
  noteText(notes: string[]): string {
    return joinSaleLineNote(notes);
  }

  /**
   * Chips of a line: the active quick notes for its product's category, then any other note it
   * already has (free text, or a quick note since deactivated) so it can be removed
   * @param line
   */
  chips(line: PosCartLine): string[] {
    const categoryId = this.categoryIdByProduct().get(line.productId);
    const labels = this._quickNotes()
      .filter((note) => quickNoteApplies(note, categoryId))
      .map((note) => note.label);
    return [...labels, ...line.notes.filter((note) => !labels.includes(note))];
  }

  /**
   * @param lineId
   */
  openOtherNote(lineId: number): void {
    this.otherNoteTooLong.set(false);
    this.otherNoteLineId.set(lineId);
  }

  closeOtherNote(): void {
    this.otherNoteTooLong.set(false);
    this.otherNoteLineId.set(null);
  }

  /**
   * Enter in the free-text input
   * @param lineId
   * @param input
   */
  addOtherNote(lineId: number, input: HTMLInputElement): void {
    if (!input.value.trim()) {
      this.closeOtherNote();
      return;
    }
    if (!this.cart.addNote(lineId, input.value)) {
      this.otherNoteTooLong.set(true);
      return;
    }
    this.closeOtherNote();
  }

  /**
   * Empty the cart after a confirmation
   */
  clear(): void {
    this._confirmationService
      .open({
        title: this._translocoService.translate('pos.clear-cart'),
        message: this._translocoService.translate('pos.clear-cart-message'),
        actions: {
          confirm: { label: this._translocoService.translate('pos.clear-cart') },
          cancel: { label: this._translocoService.translate('cancel') },
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirmed') this.cart.clear();
        this.cleared.emit();
      });
  }
}
