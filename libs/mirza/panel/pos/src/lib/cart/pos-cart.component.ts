import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  effect,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { PosCartStore } from '../pos-cart.store';
import { POS_QUICK_NOTES, PosQuickNote } from '../pos.types';

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
  readonly cart = inject(PosCartStore);

  readonly quickNotes = POS_QUICK_NOTES;

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
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * @param notes
   */
  noteText(notes: PosQuickNote[]): string {
    return notes
      .map((note) => this._translocoService.translate(`pos.quick-notes.${note}`))
      .join(this._translocoService.translate('pos.note-separator'));
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
