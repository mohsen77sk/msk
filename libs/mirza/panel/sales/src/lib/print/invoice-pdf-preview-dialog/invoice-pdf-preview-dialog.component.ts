import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { InvoicePrintData } from '../invoice-print.types';
import { SaleInvoicePrintComponent } from '../invoice-print.component';
import { SaleInvoicePdfService } from '../invoice-pdf.service';
import { SaleReceiptPrintService } from '../print.service';
import { getSaleInvoicePrintStyles } from '../invoice-print.styles';

export interface InvoicePdfPreviewDialogData {
  invoiceData: InvoicePrintData;
}

@Component({
  selector: 'mz-invoice-pdf-preview-dialog',
  templateUrl: './invoice-pdf-preview-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslocoDirective,
    MskDialogComponent,
    MskAlertComponent,
    SaleInvoicePrintComponent,
  ],
  providers: [SaleReceiptPrintService],
})
export class InvoicePdfPreviewDialogComponent implements OnInit, OnDestroy {
  readonly data = inject<InvoicePdfPreviewDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<InvoicePdfPreviewDialogComponent>);
  private _pdfService = inject(SaleInvoicePdfService);
  private _printService = inject(SaleReceiptPrintService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);

  // Full, unpaginated instance kept hidden in this dialog only to back the
  // "چاپ" fallback button - reuses the exact same print-window flow the
  // sale details dialog used before this feature existed.
  @ViewChild(SaleInvoicePrintComponent)
  private _printableInvoice?: SaleInvoicePrintComponent;

  isLoading = signal(true);
  hasError = signal(false);
  pageImageUrls = signal<string[]>([]);

  private _pdfBlob: Blob | null = null;
  private _fileName = 'factor.pdf';

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._generate();
  }

  ngOnDestroy(): void {
    this._revokePageImageUrls();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Download the generated PDF blob
   */
  download(): void {
    if (!this._pdfBlob) return;

    const url = URL.createObjectURL(this._pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this._fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Fall back to the browser print dialog, same flow as before this feature.
   */
  print(): void {
    const html = this._printableInvoice?.html;

    if (!html) {
      this._mskSnackbarService.error(this._translocoService.translate('sales.errors.printWindowBlocked'));
      return;
    }

    const opened = this._printService.print({
      html,
      title: this._translocoService.translate('sales.print-invoice'),
      styles: getSaleInvoicePrintStyles(),
      windowFeatures: 'width=900,height=1100',
    });

    if (!opened) {
      this._mskSnackbarService.error(this._translocoService.translate('sales.errors.printWindowBlocked'));
    }
  }

  /**
   * Retry PDF generation after a failure
   */
  retry(): void {
    this._generate();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _generate(): void {
    this._revokePageImageUrls();
    this.pageImageUrls.set([]);
    this._pdfBlob = null;
    this.isLoading.set(true);
    this.hasError.set(false);

    this._pdfService
      .generate(this.data.invoiceData)
      .then((result) => {
        this._pdfBlob = result.pdfBlob;
        this._fileName = result.fileName;
        this.pageImageUrls.set(result.pageImageUrls);
      })
      .catch(() => {
        this.hasError.set(true);
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  private _revokePageImageUrls(): void {
    this.pageImageUrls().forEach((url) => URL.revokeObjectURL(url));
  }
}
