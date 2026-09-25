import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { PersianDigitsPipe } from './persian-digits.pipe';
import { InvoiceLineItem, InvoicePrintData } from './invoice-print.types';

export interface InvoicePrintPageInfo {
  index: number;
  count: number;
}

@Component({
  selector: 'mz-sale-invoice-print',
  templateUrl: './invoice-print.component.html',
  styleUrl: './invoice-print.component.scss',
  imports: [MskCurrencyPipe, MskDateTimePipe, PersianDigitsPipe],
  providers: [MskCurrencyPipe],
})
export class SaleInvoicePrintComponent {
  private _mskCurrencyPipe = inject(MskCurrencyPipe);

  data = input<InvoicePrintData | null>(null);

  // Paging inputs - all optional, defaulting to "render the whole document as
  // one piece" so the existing print-window flow (which sets none of these)
  // keeps behaving exactly as before. Only the PDF pagination pipeline sets
  // these, one config per physical page.
  pageItems = input<InvoiceLineItem[] | null>(null);
  showPartyBoxes = input<boolean>(true);
  showTotals = input<boolean>(true);
  pageInfo = input<InvoicePrintPageInfo | null>(null);

  private _invoiceElement = viewChild<ElementRef<HTMLElement>>('invoice');

  get html(): string {
    return this._invoiceElement()?.nativeElement.outerHTML ?? '';
  }

  /**
   * The live element (not a string) - used by the PDF pipeline, which needs
   * an actual DOM node to measure and capture, not the receipt/print-window
   * flow's serialized outerHTML.
   */
  get element(): HTMLElement | undefined {
    return this._invoiceElement()?.nativeElement;
  }

  get renderedItems(): InvoiceLineItem[] {
    return this.pageItems() ?? this.data()?.items ?? [];
  }

  /**
   * The bare currency word (e.g. "تومان") for the currently active currency
   * setting - derived from mskCurrency itself (not hardcoded), so the table
   * headers/totals follow the same setting the amounts already do.
   */
  get currencyLabel(): string {
    const formatted = this._mskCurrencyPipe.transform(0, undefined, true) ?? '';
    return formatted.replace(/[\d,.\s]/g, '');
  }
}
