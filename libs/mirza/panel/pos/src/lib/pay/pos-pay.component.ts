import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskMaskDirective } from '@msk/shared/directives/mask';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskAutoFocusDirective } from '@msk/shared/directives/autoFocus';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { PosCartStore } from '../pos-cart.store';

type PosPaySection = 'discount' | 'note' | null;

@Component({
  selector: 'mz-pos-pay',
  templateUrl: './pos-pay.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    TranslocoDirective,
    MskCurrencyPipe,
    MskMaskDirective,
    MskSpinnerDirective,
    MskAutoFocusDirective,
    MskCurrencySymbolDirective,
  ],
})
export class PosPayComponent {
  readonly cart = inject(PosCartStore);

  readonly submitted = output<void>();

  readonly section = signal<PosPaySection>(null);
  readonly discountOpen = computed(() => this.section() === 'discount');
  readonly noteOpen = computed(() => this.section() === 'note');

  /**
   * @param section
   */
  toggle(section: Exclude<PosPaySection, null>): void {
    this.section.update((current) => (current === section ? null : section));
  }

  toggleSplit(): void {
    if (this.cart.paymentMode() === 'split') {
      this.cart.closeSplit();
    } else {
      this.cart.openSplit();
    }
  }

  /**
   * Capped at the subtotal
   * @param value
   */
  setDiscount(value: number | null): void {
    this.cart.discountInput.set(Math.min(Math.max(value ?? 0, 0), this.cart.subtotal()));
  }
}
