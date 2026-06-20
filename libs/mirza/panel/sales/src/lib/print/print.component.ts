import {
  ChangeDetectionStrategy,
  Component,
  DEFAULT_CURRENCY_CODE,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { ReceiptPrintData } from './print.types';
import { CURRENCY_BY_CODE, MskAvailableCurrencyCodes } from '@msk/shared/constants';

@Component({
  selector: 'mz-sale-receipt-print',
  templateUrl: './print.component.html',
  styleUrl: './print.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, MskCurrencyPipe, MskDateTimePipe],
})
export class SaleReceiptPrintComponent {
  private _currencyCode = inject(DEFAULT_CURRENCY_CODE) as MskAvailableCurrencyCodes;

  data = input<ReceiptPrintData | null>(null);

  private _receiptElement = viewChild<ElementRef<HTMLElement>>('receipt');

  get html(): string {
    return this._receiptElement()?.nativeElement.outerHTML ?? '';
  }

  normalizeCurrencyAmount(value: number): number {
    const config = CURRENCY_BY_CODE[this._currencyCode];
    return config.multiplier ? value / config.multiplier : value;
  }
}
