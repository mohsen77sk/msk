import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ReceiptPrintData } from './receipt-print-data.type';

@Component({
  selector: 'mz-sale-receipt-print',
  templateUrl: './sale-receipt-print.component.html',
  styleUrl: './sale-receipt-print.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MskCurrencyPipe, MskDateTimePipe, TranslocoPipe],
})
export class SaleReceiptPrintComponent {
  private _translocoService = inject(TranslocoService);

  @Input({ required: true }) data!: ReceiptPrintData;

  @ViewChild('receipt', { static: false })
  private _receiptElement?: ElementRef<HTMLElement>;

  get direction(): 'rtl' | 'ltr' {
    return this._translocoService.getActiveLang().startsWith('fa') ? 'rtl' : 'ltr';
  }

  translateUnit(unit?: string): string {
    if (!unit) {
      return '';
    }

    const key = `sales.receipt.units.${unit}`;
    const translated = this._translocoService.translate(key);

    return translated === key ? unit : translated;
  }

  get html(): string {
    return this._receiptElement?.nativeElement.outerHTML ?? '';
  }
}
