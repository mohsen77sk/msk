import {
  ChangeDetectionStrategy,
  Component,
  DEFAULT_CURRENCY_CODE,
  ElementRef,
  inject,
  input,
  LOCALE_ID,
  viewChild,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ReceiptPrintData } from './print.types';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { CURRENCY_BY_CODE, MskAvailableCurrencyCodes } from '@msk/shared/constants';

@Component({
  selector: 'mz-sale-receipt-print',
  templateUrl: './print.component.html',
  styleUrl: './print.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, MskCurrencyPipe, MskDateTimePipe, TranslocoPipe],
})
export class SaleReceiptPrintComponent {
  private _dir = inject(Directionality);
  private _translocoService = inject(TranslocoService);
  private _localeId = inject(LOCALE_ID);
  private _currencyCode = inject(DEFAULT_CURRENCY_CODE) as MskAvailableCurrencyCodes;

  data = input<ReceiptPrintData | null>(null);

  private _receiptElement = viewChild<ElementRef<HTMLElement>>('receipt');

  get direction(): Direction {
    return this._dir.value;
  }

  get html(): string {
    return this._receiptElement()?.nativeElement.outerHTML ?? '';
  }

  normalizeCurrencyAmount(value: number): number {
    const config = CURRENCY_BY_CODE[this._currencyCode];
    return config.multiplier ? value / config.multiplier : value;
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
