import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { ReceiptPrintData } from './print.types';

@Component({
  selector: 'mz-sale-receipt-print',
  templateUrl: './print.component.html',
  styleUrl: './print.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MskCurrencyPipe, MskDateTimePipe],
})
export class SaleReceiptPrintComponent {
  data = input<ReceiptPrintData | null>(null);

  private _receiptElement = viewChild<ElementRef<HTMLElement>>('receipt');

  get html(): string {
    return this._receiptElement()?.nativeElement.outerHTML ?? '';
  }
}
