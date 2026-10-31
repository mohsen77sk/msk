import { EnvironmentInjector, Injectable, createComponent, inject } from '@angular/core';
import { Store } from '@msk/mirza/shell/core/store';
import { SaleInvoice } from '../sales.types';
import { SaleReceiptPrintComponent } from './print.component';
import { SaleReceiptPrintService } from './print.service';
import { ReceiptPrintData } from './print.types';
import { SALE_RECEIPT_PRINT_STYLES } from './print.styles';

/**
 * Prints the 80mm receipt of a sale outside the sale dialog (e.g. from the POS).
 * Call it straight from a click handler: the print window is a popup.
 */
@Injectable({ providedIn: 'root' })
export class SaleReceiptPrinter {
  private _environmentInjector = inject(EnvironmentInjector);
  private _printService = new SaleReceiptPrintService();

  /**
   * Returns false when the print window was blocked
   *
   * @param sale
   * @param store
   * @param title window title
   */
  print(sale: SaleInvoice, store: Store | null, title: string): boolean {
    const receipt = createComponent(SaleReceiptPrintComponent, { environmentInjector: this._environmentInjector });
    receipt.setInput('data', new ReceiptPrintData(sale, store as Store));
    receipt.changeDetectorRef.detectChanges();
    const html = receipt.instance.html;
    receipt.destroy();

    if (!html) return false;

    return this._printService.print({
      html,
      title,
      styles: SALE_RECEIPT_PRINT_STYLES,
      windowFeatures: 'width=360,height=640',
    });
  }
}
