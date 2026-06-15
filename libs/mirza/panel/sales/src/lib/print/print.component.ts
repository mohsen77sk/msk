import { ChangeDetectionStrategy, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ReceiptPrintData } from './print.types';
import { Direction, Directionality } from '@angular/cdk/bidi';

@Component({
  selector: 'mz-sale-receipt-print',
  templateUrl: './print.component.html',
  styleUrl: './print.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MskCurrencyPipe, MskDateTimePipe, TranslocoPipe],
})
export class SaleReceiptPrintComponent {
  private _dir = inject(Directionality);
  private _translocoService = inject(TranslocoService);

  data = input<ReceiptPrintData | null>(null);

  private _receiptElement = viewChild<ElementRef<HTMLElement>>('receipt');

  get direction(): Direction {
    return this._dir.value;
  }

  get html(): string {
    return this._receiptElement()?.nativeElement.outerHTML ?? '';
  }

  translateUnit(unit?: string): string {
    if (!unit) {
      return '';
    }

    const key = `sales.receipt.units.${unit}`;
    const translated = this._translocoService.translate(key);
    return translated === key ? unit : translated;
  }
}
